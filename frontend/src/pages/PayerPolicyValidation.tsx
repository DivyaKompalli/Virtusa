import React from "react";
import { usePipeline } from "../context/PipelineContext";

const PayerPolicyValidation = () => {
  const { latestResult } = usePipeline();
  const decision = latestResult?.pa_decision;
  const bundle = latestResult?.clinical_bundle;
  const met = decision?.criteria_met || [];
  const missing = decision?.criteria_missing || [];
  const total = met.length + missing.length;

  return (
    <>
      {/* TopAppBar (Shared Component) */}

      {/* Page Content */}
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary-fixed rounded uppercase tracking-wider">
                Case: {bundle?.cpt_code || "N/A"}
              </span>
              <span className="text-[10px] font-bold text-secondary-fixed-dim px-2 py-0.5 bg-secondary-fixed rounded uppercase tracking-wider">
                Urgency: Routine
              </span>
            </div>
            <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
              Validation: {bundle?.cpt_code ? `CPT ${bundle.cpt_code}` : "Policy Match"}
            </h2>
            <p className="text-on-surface-variant mt-1 font-medium">
              Comparing extracted findings against selected payer policy.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-md border border-outline/20 text-on-surface font-semibold text-sm hover:bg-surface-container transition-all active:scale-95">
              Request Additional Info
            </button>
            <button className="px-6 py-2.5 rounded-md tonal-transition text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              Submit for Approval
            </button>
          </div>
        </div>
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Summary Stats (Top Row) */}
          <div className="col-span-12 grid grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-1">
                Total Requirements
              </p>
              <p className="text-2xl font-black font-headline">
                {total > 0 ? total : "06"}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-1">
                Criteria Met
              </p>
              <p className="text-2xl font-black font-headline text-tertiary">
                {total > 0 ? met.length : "04"}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-1">
                Manual Review
              </p>
              <p className="text-2xl font-black font-headline text-amber-500">
                {total > 0 ? missing.length : "01"}
              </p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-[11px] font-bold text-outline uppercase tracking-widest mb-1">
                Confidence Score
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black font-headline text-primary">
                  {decision?.confidence || 92}%
                </p>
                <span className="text-xs font-bold text-tertiary-fixed-dim bg-tertiary-container/10 px-1 rounded">
                  High
                </span>
              </div>
            </div>
          </div>
          {/* Validation Comparison Table (Main Column) */}
          <div className="col-span-8 space-y-4">
            <div className="bg-surface-container-low p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary-fixed-variant flex items-center gap-2 uppercase tracking-wide">
                <span className="material-symbols-outlined text-[20px]">
                  fact_check
                </span>
                Policy Consistency Check
              </h3>
              <div className="flex gap-2">
                <span
                  className="w-3 h-3 rounded-full bg-tertiary"
                  title="Met"
                ></span>
                <span
                  className="w-3 h-3 rounded-full bg-amber-500"
                  title="Review"
                ></span>
                <span
                  className="w-3 h-3 rounded-full bg-error"
                  title="Missing"
                ></span>
              </div>
            </div>
            {/* Comparison Item 1 (Success) */}
            {total > 0 ? (
              <>
                {met.map((crit: string, i: number) => (
                  <div
                    key={`met-${i}`}
                    className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex gap-6 items-start"
                  >
                    <div className="bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                          Payer Requirement
                        </label>
                        <p className="text-sm font-bold text-on-surface leading-relaxed">
                          {crit}
                        </p>
                      </div>
                      <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-surface-container-highest">
                        <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                          Clinical Findings
                        </label>
                        <p className="text-sm text-secondary leading-relaxed italic">
                          Satisfied based on clinical notes.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {missing.map((crit: string, i: number) => (
                  <div
                    key={`miss-${i}`}
                    className="bg-surface-container-lowest p-6 rounded-xl border border-error/50 bg-error-container/10 flex gap-6 items-start"
                  >
                    <div className="bg-error-container text-error w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">cancel</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                          Payer Requirement
                        </label>
                        <p className="text-sm font-bold text-on-surface leading-relaxed">
                          {crit}
                        </p>
                      </div>
                      <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-error/30">
                        <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                          Clinical Findings
                        </label>
                        <p className="text-sm text-secondary leading-relaxed italic">
                          Missing or insufficient evidence.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex gap-6 items-start">
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Payer Requirement
                      </label>
                      <p className="text-sm font-bold text-on-surface leading-relaxed">
                        Evidence of radiculopathy or persistent neurological
                        deficits localized to lumbar spine.
                      </p>
                    </div>
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-surface-container-highest">
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Clinical Findings
                      </label>
                      <p className="text-sm text-secondary leading-relaxed italic">
                        "Patient exhibits L5-S1 disc herniation as noted in
                        orthopedic consult. Decreased patellar reflex noted on
                        right side."
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container text-[10px] font-bold text-primary rounded">
                        <span className="material-symbols-outlined text-[12px]">
                          link
                        </span>
                        Source: Ortho_Notes_v2.pdf
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comparison Item 2 (Warning/Review) */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-amber-200/50 bg-amber-50/20 flex gap-6 items-start">
                  <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Payer Requirement
                      </label>
                      <p className="text-sm font-bold text-on-surface leading-relaxed">
                        Completion of 6 weeks of conservative therapy (PT,
                        chiropractic, or medication).
                      </p>
                    </div>
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-amber-200">
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Clinical Findings
                      </label>
                      <p className="text-sm text-secondary leading-relaxed italic">
                        "Patient has been in active PT for 4 weeks. Reports
                        minimal improvement in mobility."
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                          Duration Mismatch (4/6 Weeks)
                        </span>
                        <button className="text-[11px] font-bold text-primary hover:underline underline-offset-4 uppercase tracking-wider">
                          Override Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comparison Item 3 (Success) */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex gap-6 items-start">
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Payer Requirement
                      </label>
                      <p className="text-sm font-bold text-on-surface leading-relaxed">
                        Recent weight-bearing X-ray (within 6 months) to rule
                        out fracture.
                      </p>
                    </div>
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-surface-container-highest">
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Clinical Findings
                      </label>
                      <p className="text-sm text-secondary leading-relaxed italic">
                        "Radiology report 08/12/2023 confirms no acute fracture
                        or listhesis. Mild degenerative changes."
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container text-[10px] font-bold text-primary rounded">
                        <span className="material-symbols-outlined text-[12px]">
                          calendar_today
                        </span>
                        Exam Date: 4 Months Ago
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comparison Item 4 (Success) */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex gap-6 items-start">
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Payer Requirement
                      </label>
                      <p className="text-sm font-bold text-on-surface leading-relaxed">
                        No contraindications for MRI (pacemaker, metallic
                        implants).
                      </p>
                    </div>
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-surface-container-highest">
                      <label className="text-[10px] font-black uppercase text-outline tracking-wider mb-2 block">
                        Clinical Findings
                      </label>
                      <p className="text-sm text-secondary leading-relaxed italic">
                        "Surgical history reviewed: Appendectomy only. Patient
                        cleared safety questionnaire for MRI."
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Side Panel (Analysis & Actions) */}
          <div className="col-span-4 space-y-6">
            {/* Policy Snapshot */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="tonal-transition p-5">
                <h4 className="text-white font-headline font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">description</span>
                  Policy Reference
                </h4>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-tighter">
                      Payer
                    </p>
                    <p className="text-sm font-bold">{bundle?.payer?.toUpperCase() || "Unknown"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-tighter">
                      Effective Date
                    </p>
                    <p className="text-sm font-bold">Jan 2024</p>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low rounded-lg">
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                    {(decision?.policy_sources && decision.policy_sources.length > 0)
                      ? `Matched sources: ${decision.policy_sources.join(", ")}`
                      : "No policy sources were returned for this run."}
                  </p>
                  <a
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    href="#"
                  >
                    Read Full Policy MS-102
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </a>
                </div>
              </div>
            </div>
            {/* AI Confidence Insight */}
            <div className="bg-white rounded-xl border border-primary/20 p-6">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  insights
                </span>
                Curator Insight
              </h4>
              <p className="text-xs text-secondary leading-relaxed mb-4">
                {decision?.reason || (
                  <>
                    We detected a potential{" "}
                    <span className="font-bold text-on-surface">
                      Timeline Conflict
                    </span>{" "}
                    regarding the 6-week conservative therapy rule. While the
                    clinical notes mention 4 weeks of PT, they also mention a
                    previous "history of NSAID use for 3 months" which may
                    satisfy the medical necessity criteria.
                  </>
                )}
              </p>
              <div className="flex flex-col gap-2">
                <button className="w-full py-2 bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded hover:brightness-95 transition-all">
                  ATTACH NSAID PHARMACY RECORDS
                </button>
                <button className="w-full py-2 border border-outline-variant/30 text-outline text-[11px] font-bold rounded hover:bg-slate-50 transition-all">
                  DISMISS INSIGHT
                </button>
              </div>
            </div>
            {/* Document Links */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10">
              <h4 className="text-[11px] font-black uppercase text-outline tracking-widest mb-4">
                Supporting Documentation
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg group cursor-pointer hover:bg-primary-fixed/20 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      picture_as_pdf
                    </span>
                    <span className="text-xs font-semibold">
                      Ortho_Notes_v2.pdf
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">
                    visibility
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg group cursor-pointer hover:bg-primary-fixed/20 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      analytics
                    </span>
                    <span className="text-xs font-semibold">
                      Radiology_Report_L-Spine.pdf
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[18px]">
                    visibility
                  </span>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-outline-variant/40 rounded-lg flex items-center justify-center gap-2 text-outline text-xs font-bold hover:bg-slate-50 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  UPLOAD MORE
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Action Bar */}
        <div className="mt-12 pt-8 border-t border-outline-variant/20 flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs text-outline font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> System
              Ready
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Policy
              Updated 2h ago
            </span>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-md text-on-surface-variant font-bold text-sm hover:text-on-surface transition-colors">
              Discard &amp; Restart
            </button>
            <button className="px-10 py-3 rounded-md tonal-transition text-white font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
              FINAL SUBMISSION
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayerPolicyValidation;
