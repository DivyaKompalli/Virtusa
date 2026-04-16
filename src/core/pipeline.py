"""
pipeline.py
===========
Full Prior Authorization Pipeline — single entry point.

Flow:
    Input (patient_id OR ehr_note OR structured dict)
         ↓
    clinical_reader_agent.extract()
         ↓
    policy_agent.run_policy_agent()
         ↓
    appeal_agent.generate_appeal()  ← only if DENIED
         ↓
    Final PA Result dict

Usage:
    python pipeline.py
    OR import and call run_pipeline() from your app / FastAPI
"""

import json
import os
import uuid
import base64
from datetime import datetime
from typing import Union

from src.agents.clinical_reader_agent import extract as clinical_extract, save_bundle
from src.agents.policy_agent           import run_policy_agent
from src.agents.appeal_agent           import generate_appeal
from src.agents.clinical_reader_agent  import read_from_csv  # for normalise_input shortcut
from src.core.form_filler              import fill_pa_form


def run_pipeline(
    input_data,           # int (patient_id) | str (EHR note) | dict
    payer: str = "unknown",
    vector_store: str = "./vector_store",
    save_outputs: bool = True,
    output_dir: str = "output",
) -> dict:
    """
    Run the complete PA pipeline end-to-end.

    Args:
        input_data    : patient_id (int), EHR note (str), or pre-built dict
        payer         : "uhc" / "aetna" / "cigna"
        vector_store  : path to FAISS vector store root
        save_outputs  : save JSON bundles to disk
        output_dir    : folder for output files

    Returns:
        {
          "clinical_bundle": {...},   ← from clinical reader
          "pa_decision": {...},       ← from policy agent
          "appeal_letter": "..." ,    ← only if DENIED
          "pipeline_summary": {...}   ← quick stats
        }
    """

    print("\n" + "╔" + "═"*58 + "╗")
    print("║   PRIOR AUTHORIZATION PIPELINE — START" + " "*19 + "║")
    print("╚" + "═"*58 + "╝\n")

    # ── STEP 1: Clinical Reader ───────────────────────────────────────────────
    print("━"*60)
    print("STEP 1 │ Clinical Reader Agent")
    print("━"*60)

    clinical_bundle = clinical_extract(input_data, payer=payer)

    if "error" in clinical_bundle:
        return {
            "clinical_bundle": clinical_bundle,
            "pa_decision": {"decision": "ERROR", "reason": clinical_bundle["error"]},
            "appeal_letter": None,
            "pipeline_summary": {"status": "FAILED_AT_CLINICAL_READER"},
        }

    print(f"   Mode       : {clinical_bundle.get('mode', 'unknown').upper()}")
    print(f"   Method     : {clinical_bundle.get('extraction_method')}")
    print(f"   Payer      : {clinical_bundle.get('payer', '?').upper()}")
    print(f"   ICD codes  : {clinical_bundle.get('icd_codes')}")
    print(f"   CPT code   : {clinical_bundle.get('cpt_code')}")
    print(f"   Confidence : {clinical_bundle.get('confidence_score')}")

    all_codes = clinical_bundle.get("codes", {})
    if any(all_codes.values()):
        print(f"   All codes  :")
        for ctype, codes in all_codes.items():
            if codes:
                print(f"     {ctype.upper():8s}: {codes}")

    if save_outputs:
        save_bundle(clinical_bundle, output_dir)

    # ── STEP 2: Policy Agent (RAG + Decision) ─────────────────────────────────
    print("\n" + "━"*60)
    print("STEP 2 │ Policy Agent (RAG + Gemini Decision)")
    print("━"*60)

    try:
        pa_decision = run_policy_agent(clinical_bundle, vector_store_dir=vector_store)
    except Exception as e:
        pa_decision = {
            "decision":   "ERROR",
            "reason":     f"Policy agent failed: {e}",
            "confidence": 0,
        }

    decision = pa_decision.get("decision", "ERROR")
    print(f"\n   ━━━ DECISION: {decision} ━━━")
    print(f"   Confidence : {pa_decision.get('confidence', '?')}%")
    print(f"   Reason     : {pa_decision.get('reason', '')[:200]}")

    if pa_decision.get("criteria_met"):
        print(f"   Met        : {pa_decision['criteria_met']}")
    if pa_decision.get("criteria_missing"):
        print(f"   Missing    : {pa_decision['criteria_missing']}")

    pre = pa_decision.get("pre_submission_risk", {})
    if pre:
        print(f"   Pre-score  : {pre.get('risk_level')} ({pre.get('approval_probability')}%)")

    # ── STEP 3: Appeal (only if DENIED) ──────────────────────────────────────
    appeal_letter = None

    if decision == "DENIED":
        print("\n" + "━"*60)
        print("STEP 3 │ Appeal Generator (decision = DENIED)")
        print("━"*60)
        try:
            # normalise patient dict for appeal agent
            patient_for_appeal = {
                "payer":     clinical_bundle.get("payer", ""),
                "icd_codes": clinical_bundle.get("icd_codes", []),
                "cpt_code":  clinical_bundle.get("cpt_code",  ""),
                "summary":   clinical_bundle.get("summary",   ""),
                "evidence":  clinical_bundle.get("evidence",  ""),
            }
            appeal_letter = generate_appeal(patient_for_appeal, pa_decision)
            print("\n📝 Appeal letter generated successfully.")
            print("   Preview:", appeal_letter[:200].replace("\n", " "), "...")
        except Exception as e:
            appeal_letter = f"Appeal generation failed: {e}"
            print(f"   ⚠️  {appeal_letter}")
    else:
        print(f"\n   ℹ️  No appeal needed — decision is {decision}")

    # ── STEP 4: Fill PA Form ─────────────────────────────────────────────────
    print("\n" + "━"*60)
    print("STEP 4 │ Form Filler")
    print("━"*60)

    filled_form_path = None
    encoded_pdf = None
    try:
        patient_id_label = str(input_data) if isinstance(input_data, int) else "ehr"
        # Resolve the absolute path to the project root
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        template_pdf = os.path.join(project_root, "data", "inputs", "PA-Request-Form-UHC-Community-Plan.pdf")
        output_pdf = os.path.join(output_dir, f"patient_{patient_id_label}_filled_form.pdf")

        labs_evidence = clinical_bundle.get("supporting_evidence", "")
        if isinstance(labs_evidence, list):
            labs_evidence = "\n".join(str(e) for e in labs_evidence)

        mapped_data = {
            "name": clinical_bundle.get("patient_name", "John Doe"),
            "member_id": f"UHC-{uuid.uuid4().hex[:6].upper()}",
            "dob": "01/01/1990",
            "address": "N/A",
            "city": "N/A",
            "state": "N/A",
            "zip": "000000",
            "phone": "0000000000",
            "allergies": "NKA",

            "provider": "Dr. AutoAuth",
            "npi": "1234567890",
            "specialty": "General",
            "office_phone": "0000000000",
            "office_fax": "0000000000",
            "office_address": "AutoAuth Clinic",
            "office_city": "N/A",
            "office_state": "N/A",
            "office_zip": "000000",

            "medication": clinical_bundle.get("cpt_code", ""),
            "strength": "",
            "directions": "",
            "quantity": "",

            "diagnosis": clinical_bundle.get("summary", ""),
            "icd": ", ".join(clinical_bundle.get("icd_codes", [])),

            "history": clinical_bundle.get("summary", ""),
            "contra": "N/A",
            "labs": labs_evidence,
            "additional": "Auto-generated by AutoAuth Agent",

            "date": datetime.now().strftime("%m/%d/%Y"),
        }

        os.makedirs(output_dir, exist_ok=True)
        fill_pa_form(mapped_data, template_pdf, output_pdf)
        filled_form_path = output_pdf
        print(f"   ✅ Form generated at: {filled_form_path}")

        with open(output_pdf, "rb") as pdf_file:
            encoded_pdf = base64.b64encode(pdf_file.read()).decode('utf-8')
    except Exception as e:
        print(f"   ⚠️  Form generation failed: {e}")

    # ── FINAL RESULT ──────────────────────────────────────────────────────────
    result = {
        "clinical_bundle": clinical_bundle,
        "pa_decision":     pa_decision,
        "appeal_letter":   appeal_letter,
        "filled_form_path": filled_form_path,
        "filled_form_base64": encoded_pdf,
        "pipeline_summary": {
            "status":              decision,
            "payer":               clinical_bundle.get("payer"),
            "icd_codes":           clinical_bundle.get("icd_codes"),
            "cpt_code":            clinical_bundle.get("cpt_code"),
            "all_codes":           clinical_bundle.get("codes", {}),
            "confidence":          pa_decision.get("confidence"),
            "pre_approval_score":  pre.get("approval_probability"),
            "risk_level":          pre.get("risk_level"),
            "extraction_method":   clinical_bundle.get("extraction_method"),
            "appeal_generated":    appeal_letter is not None,
            "policy_sources":      pa_decision.get("policy_sources", []),
        }
    }

    # Save final result
    if save_outputs:
        os.makedirs(output_dir, exist_ok=True)
        out_path = f"{output_dir}/pa_result_{clinical_bundle.get('bundle_id','')[:8]}.json"
        result_to_save = dict(result)
        result_to_save["appeal_letter"] = appeal_letter  # keep as string
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(result_to_save, f, indent=2)
        print(f"\n💾 Full result saved: {out_path}")

    print("\n" + "╔" + "═"*58 + "╗")
    print(f"║   PIPELINE COMPLETE — {decision:<38}║")
    print("╚" + "═"*58 + "╝\n")

    return result


# ─────────────────────────────────────────────────────────────────────────────
# QUICK DEMO
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Choose test mode:")
    print("  1 — CSV patient (needs patients.csv)")
    print("  2 — EHR text note (built-in sample)")
    choice = input("Enter 1 or 2: ").strip()

    if choice == "1":
        pid   = int(input("Patient ID: ").strip())
        payer = input("Payer (uhc/aetna/cigna): ").strip() or "uhc"
        result = run_pipeline(pid, payer=payer)

    else:
        sample_note = """
        PATIENT: John Smith | Payer: UHC | Member: UHC-44821
        Dx: Severe persistent asthma (J45.51) with acute exacerbation.
        CPT: 94640 (nebulizer treatment), 94060 (spirometry)
        HbA1c: 6.1% (normal). Peak flow: 52% predicted.
        Two ER visits in past 90 days for asthma exacerbations.
        Currently on albuterol SABA — used daily (step 2).
        Failed inhaled corticosteroid step-up (budesonide 180mcg).
        Specialist (pulmonologist) referral documented 2024-11-10.
        Medical Necessity: Step therapy failure documented. Patient requires
        biologic therapy (dupilumab) for severe uncontrolled asthma.
        LOINC: 19926-5 (FEV1). BP: 122/78 mmHg.
        """
        result = run_pipeline(sample_note, payer="uhc")

    # Print summary
    print("\n📊 PIPELINE SUMMARY:")
    summary = result["pipeline_summary"]
    for k, v in summary.items():
        print(f"   {k:25s}: {v}")

    if result.get("appeal_letter"):
        print("\n📝 APPEAL LETTER:")
        print("-" * 60)
        print(result["appeal_letter"])
