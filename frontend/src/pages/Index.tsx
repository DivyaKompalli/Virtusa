import { useState, useCallback } from "react";
import { Sidebar } from "@/components/autoauth/Sidebar";
import { TopBar } from "@/components/autoauth/TopBar";
import { InputPanel } from "@/components/autoauth/InputPanel";
import { ResultsPanel } from "@/components/autoauth/ResultsPanel";

const SCENARIOS = [
  "Asthma Exacerbation (nebulizer)",
  "Surgical — Lumbar Laminectomy / Discectomy (CPT 63030)",
];

const SAMPLE_RESULTS: Record<string, any> = {
  "Asthma Exacerbation (nebulizer)": {
    clinical_bundle: {
      mode: "ehr",
      patient_name: "John Smith",
      summary: "Severe persistent asthma with acute exacerbation. Two ER visits in past 90 days. Daily SABA use. Peak flow 52% predicted.",
      patient_summary: "Severe persistent asthma with acute exacerbation. Two ER visits in past 90 days. Daily SABA use.",
      codes: { icd10: ["J45.51"], cpt: ["94640", "94060"], hcpcs: [], loinc: [] },
      icd_codes: ["J45.51"],
      cpt_code: "94640",
      supporting_evidence: [
        "Peak flow 52% predicted",
        "Failed inhaled corticosteroid step-up (budesonide)",
        "Two ER visits in past 90 days",
        "Pulmonology referral documented",
      ],
      confidence: 0.92,
      extraction_method: "EHR NLP extraction",
      payer: "aetna",
    },
    pa_decision: {
      decision: "APPROVED",
      confidence: 88,
      reason: "Patient meets medical necessity criteria for nebulizer treatment. Failed step-up therapy, documented ER utilization, and specialist referral support escalation.",
      criteria_met: [
        "Diagnosis confirmed with ICD-10 J45.51",
        "Failed conservative therapy (budesonide)",
        "ER utilization documented (2 visits in 90 days)",
        "Specialist referral present",
      ],
      criteria_missing: [],
      pre_submission_risk: { approval_probability: 85, risk_level: "LOW" },
      policy_sources: ["Aetna_Asthma_Policy_2024.pdf", "Nebulizer_Coverage_Guidelines.pdf"],
      appeal_hint: null,
    },
  },
  "Surgical — Lumbar Laminectomy / Discectomy (CPT 63030)": {
    clinical_bundle: {
      mode: "ehr",
      patient_name: "Jane Doe",
      summary: "Chronic lumbar radiculopathy with L4-L5 disc herniation. 12-month history. MRI confirmed nerve root compression. VAS 8/10.",
      patient_summary: "Chronic lumbar radiculopathy. Failed conservative treatment including 8+ weeks PT, NSAIDs, and epidural steroid injections x2.",
      codes: { icd10: ["M54.16", "M51.06"], cpt: ["63030"], hcpcs: [], loinc: [] },
      icd_codes: ["M54.16", "M51.06"],
      cpt_code: "63030",
      supporting_evidence: [
        "MRI 02/2024: L4-L5 disc herniation with nerve root compression",
        "Failed 8+ weeks physical therapy",
        "Failed NSAIDs and epidural steroid injection x2",
        "Positive straight leg raise",
        "Sensory deficit in L5 distribution",
      ],
      confidence: 0.95,
      extraction_method: "EHR NLP extraction",
      payer: "uhc",
    },
    pa_decision: {
      decision: "DENIED",
      confidence: 72,
      reason: "Insufficient documentation of conservative therapy duration. Policy requires minimum 12 weeks of documented physical therapy before surgical intervention.",
      criteria_met: [
        "MRI imaging confirms pathology",
        "Neurologic deficit documented",
        "Diagnosis codes valid",
      ],
      criteria_missing: [
        "PT duration below 12-week minimum (only 8 weeks documented)",
        "No chiropractic evaluation on file",
        "Missing functional assessment score",
      ],
      pre_submission_risk: { approval_probability: 35, risk_level: "HIGH" },
      policy_sources: ["UHC_Spine_Surgery_Policy_2024.pdf", "Laminectomy_Medical_Necessity.pdf"],
      appeal_hint: "Document additional 4 weeks of PT or provide clinical justification for early surgical intervention due to progressive neurological deficit.",
    },
  },
};

const INITIAL_METRICS = { totalRuns: 12, approvals: 7, denials: 3, pending: 1, errors: 1, daysSaved: 24.5 };
const INITIAL_PAYER_STATS = [
  { payerId: "aetna", runs: 5, approved: 4, approvalRate: 0.8 },
  { payerId: "uhc", runs: 4, approved: 2, approvalRate: 0.5 },
  { payerId: "cigna", runs: 3, approved: 1, approvalRate: 0.33 },
];
const INITIAL_RECENT = [
  { payerId: "aetna", cpt: "94640", status: "APPROVED" as const },
  { payerId: "uhc", cpt: "63030", status: "DENIED" as const },
  { payerId: "cigna", cpt: "99213", status: "PENDING" as const },
  { payerId: "aetna", cpt: "99214", status: "APPROVED" as const },
];

const Index = () => {
  const [payer, setPayer] = useState("aetna");
  const [inputMode, setInputMode] = useState<"csv" | "ehr">("ehr");
  const [ehrNote, setEhrNote] = useState("");
  const [csvPatient, setCsvPatient] = useState(1);
  const [forceDenial, setForceDenial] = useState(false);
  const [saveOutputs, setSaveOutputs] = useState(true);
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [appealLetter, setAppealLetter] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [payerStats] = useState(INITIAL_PAYER_STATS);
  const [recentRuns, setRecentRuns] = useState(INITIAL_RECENT);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setAppealLetter(null);
    setTimeout(() => {
      let res = SAMPLE_RESULTS[scenario] || SAMPLE_RESULTS[SCENARIOS[0]];
      if (forceDenial) {
        res = {
          ...res,
          pa_decision: {
            ...res.pa_decision,
            decision: "DENIED",
            reason: "Forced denial for demo purposes.",
            criteria_missing: ["Demo: missing documentation"],
            appeal_hint: "Provide documentation and re-submit.",
          },
        };
      }
      setResult(res);
      const dec = res.pa_decision?.decision || "ERROR";
      setMetrics((m) => ({
        ...m,
        totalRuns: m.totalRuns + 1,
        approvals: m.approvals + (dec === "APPROVED" ? 1 : 0),
        denials: m.denials + (dec === "DENIED" ? 1 : 0),
        pending: m.pending + (dec === "PENDING_MORE_INFO" ? 1 : 0),
        daysSaved: m.daysSaved + (dec === "APPROVED" ? 3 : dec === "DENIED" ? 1 : 0.5),
      }));
      setRecentRuns((r) => [
        { payerId: payer, cpt: res.clinical_bundle?.cpt_code || "—", status: dec === "APPROVED" ? "APPROVED" : dec === "DENIED" ? "DENIED" : "PENDING" },
        ...r.slice(0, 6),
      ]);
      setIsRunning(false);
    }, 1800);
  }, [scenario, forceDenial, payer]);

  const handleAppeal = useCallback(() => {
    setAppealLetter(
      `PRIOR AUTHORIZATION APPEAL LETTER\n\nDate: ${new Date().toLocaleDateString()}\n\nTo: Health Insurance Appeals Department\n\nRe: Appeal of Denied Prior Authorization\nPatient: ${result?.clinical_bundle?.patient_name || "Patient"}\n\nDear Appeals Review Board,\n\nI am writing to formally appeal the denial of prior authorization for the requested procedure. The clinical evidence strongly supports medical necessity.\n\nThe patient has demonstrated:\n- Confirmed diagnosis with appropriate ICD-10 coding\n- Failed conservative treatment measures\n- Progressive symptoms requiring intervention\n\nWe respectfully request reconsideration of this authorization.\n\nSincerely,\nDr. AutoAuth\nAutoAuth Clinical Intelligence System`
    );
  }, [result]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        metrics={metrics}
        payerStats={payerStats}
        recentRuns={recentRuns}
        onReset={() => setMetrics({ totalRuns: 0, approvals: 0, denials: 0, pending: 0, errors: 0, daysSaved: 0 })}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
            <div>
              <InputPanel
                payer={payer} setPayer={setPayer}
                inputMode={inputMode} setInputMode={setInputMode}
                ehrNote={ehrNote} setEhrNote={setEhrNote}
                csvPatient={csvPatient} setCsvPatient={setCsvPatient}
                forceDenial={forceDenial} setForceDenial={setForceDenial}
                saveOutputs={saveOutputs} setSaveOutputs={setSaveOutputs}
                scenario={scenario} setScenario={setScenario}
                scenarios={SCENARIOS}
                onRun={handleRun}
                isRunning={isRunning}
              />
            </div>
            <div>
              <ResultsPanel
                result={result}
                onGenerateAppeal={handleAppeal}
                appealLetter={appealLetter}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
