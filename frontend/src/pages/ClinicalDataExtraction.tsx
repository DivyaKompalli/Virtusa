import React from "react";
import { usePipeline } from "../context/PipelineContext";

const ClinicalDataExtraction = () => {
  const { latestResult } = usePipeline();
  const bundle = latestResult?.clinical_bundle;
  const confidencePct = bundle?.confidence
    ? Math.round(Number(bundle.confidence) * 100)
    : 98;

  return (
    <>
      {/* TopAppBar */}

      {/* Dynamic Content Canvas */}
      <div className="p-8 flex-1 flex flex-col gap-8">
        {/* File Upload Bento Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Drop Zone */}
          <div className="md:col-span-2 group relative border-2 border-dashed border-outline-variant/30 hover:border-primary/50 rounded-xl bg-surface-container-lowest transition-all duration-300 flex flex-col items-center justify-center p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="cloud_upload"
                >
                  cloud_upload
                </span>
              </div>
              <h2 className="text-lg font-bold text-on-surface mb-2">
                Drop clinical notes here
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Supports PDF, DOCX, or high-res scans (OCR enabled)
              </p>
              <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-md shadow-sm hover:opacity-90 transition-opacity active:scale-95">
                Browse Files
              </button>
            </div>
          </div>
          {/* Recent Activity/Guidance */}
          <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <span
                className="material-symbols-outlined text-sm"
                data-icon="lightbulb"
              >
                lightbulb
              </span>
              Extraction Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="text-on-surface-variant">
                  Ensure patient ID is clearly visible at the header.
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="text-on-surface-variant">
                  Include relevant discharge summaries if available.
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                <span className="text-on-surface-variant">
                  AI supports multi-page medical record analysis.
                </span>
              </li>
            </ul>
            <div className="mt-auto p-4 bg-primary-fixed-dim/20 rounded-lg border border-primary-fixed-dim/30">
              <div className="text-xs font-bold text-on-primary-fixed-variant mb-1">
                AI READY
              </div>
              <p className="text-xs text-on-primary-fixed-variant/80">
                Extraction model updated 2h ago to v4.2.1-Clinical
              </p>
            </div>
          </div>
        </section>
        {/* Main Workspace: Side-by-Side View */}
        <section className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
          {/* Left: Original Clinical Note Preview */}
          <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="bg-surface-container flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-secondary"
                  data-icon="description"
                >
                  description
                </span>
                <span className="font-semibold text-sm">
                  Case_Note_7742_Alpha.pdf
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 rounded-lg p-1">
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="zoom_in"
                  >
                    zoom_in
                  </span>
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="zoom_out"
                  >
                    zoom_out
                  </span>
                </button>
                <button className="p-1.5 hover:bg-white rounded transition-colors">
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="download"
                  >
                    download
                  </span>
                </button>
              </div>
            </div>
            {/* Document Canvas */}
            <div className="flex-1 bg-surface-dim p-8 flex justify-center overflow-auto">
              <div className="w-full max-w-2xl bg-white shadow-2xl rounded-sm p-12 min-h-[1000px] text-slate-800 leading-relaxed font-body">
                <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-1">
                      Clinical Note
                    </h4>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                      North Memorial Medical Center
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Ref: #7742-A</p>
                    <p className="text-sm text-slate-500">Date: Oct 24, 2023</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <section>
                    <h5 className="text-xs font-black uppercase text-slate-400 mb-2">
                      Clinical Note Extract
                    </h5>
                    <p className="text-sm whitespace-pre-wrap">
                      {latestResult?.ehr_note ||
                        bundle?.summary ||
                        "No active case found. Patient presents with recurring lumbar pain radiating to the left lower extremity (L5-S1 distribution). Pain has persisted for 6 months despite conservative management including physical therapy and NSAIDs. Patient reports 8/10 pain scale during acute flare-ups."}
                    </p>
                  </section>
                  {!latestResult && (
                    <>
                      <section>
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-2">
                          Objective
                        </h5>
                        <p className="text-sm">
                          Physical exam reveals positive straight leg raise on
                          the left at 45 degrees. Decreased sensation noted in
                          the L5 dermatome. MRI from 10/12/23 shows L5-S1 disc
                          protrusion with mild stenosis.
                        </p>
                      </section>
                      <section>
                        <h5 className="text-xs font-black uppercase text-slate-400 mb-2">
                          Assessment &amp; Plan
                        </h5>
                        <p className="text-sm">
                          1. Lumbar disc herniation with radiculopathy (M54.16).
                          <br />
                          2. Plan for Lumbar Laminectomy (63030) to decompress
                          the nerve root.
                          <br />
                          3. Patient instructed to continue Pregabalin 75mg BID
                          until surgery.
                        </p>
                      </section>
                    </>
                  )}
                </div>
                <div className="mt-20 pt-8 border-t border-slate-100">
                  <p className="text-xs italic text-slate-400 text-center">
                    Electronically signed by Dr. Sarah Chen, MD - Board
                    Certified Orthopedic Surgeon
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: AI Extraction Panel */}
          <div className="w-full lg:w-[450px] bg-surface-container-low rounded-xl flex flex-col overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary to-primary-container text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined" data-icon="bolt">
                    bolt
                  </span>
                  AI Extraction
                </h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-semibold">
                  {confidencePct}% Confidence
                </span>
              </div>
              <p className="text-xs text-on-primary-container/80">
                Entity recognition completed. Please verify the following
                points.
              </p>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Diagnosis Section */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                  Diagnoses (ICD-10)
                </label>
                <div className="space-y-3">
                  {(bundle?.icd_codes || ["M54.16"]).map(
                    (code: string, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between group"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-cyan-900">
                            {code}
                          </span>
                          <span className="text-sm text-on-surface">
                            Extracted Diagnosis
                          </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-cyan-700 hover:bg-cyan-50 rounded">
                            <span
                              className="material-symbols-outlined text-sm"
                              data-icon="edit"
                            >
                              edit
                            </span>
                          </button>
                          <button className="p-1 text-tertiary hover:bg-tertiary-fixed rounded">
                            <span
                              className="material-symbols-outlined text-sm"
                              data-icon="check_circle"
                              data-weight="fill"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check_circle
                            </span>
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
              {/* Procedures Section */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                  Procedures (CPT)
                </label>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-tertiary flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-cyan-900">
                        {bundle?.cpt_code || bundle?.cpt_codes?.[0] || "63030"}
                      </span>
                      <span className="text-sm text-on-surface">
                        Extracted Procedure
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-full uppercase">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Medications Section */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                  Medications
                </label>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface">
                        Pregabalin 75mg
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Twice daily (BID)
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-cyan-700 hover:bg-cyan-50 rounded">
                        <span
                          className="material-symbols-outlined text-sm"
                          data-icon="edit"
                        >
                          edit
                        </span>
                      </button>
                      <button className="p-1 text-slate-400 hover:text-tertiary transition-colors">
                        <span
                          className="material-symbols-outlined text-sm"
                          data-icon="check_circle"
                        >
                          check_circle
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Patient History */}
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-3">
                  Clinical Evidence
                </label>
                <div className="bg-white rounded-lg p-3 shadow-sm space-y-3">
                  {(
                    bundle?.supporting_evidence || [
                      "Pain has persisted for 6 months despite conservative management including physical therapy...",
                    ]
                  ).map((ev: string, i: number) => (
                    <div
                      key={i}
                      className="text-sm text-on-surface p-2 bg-slate-50 rounded"
                    >
                      "{ev}"
                    </div>
                  ))}
                  <div className="flex items-center gap-2 px-1">
                    <span
                      className="material-symbols-outlined text-xs text-primary"
                      data-icon="link"
                    >
                      link
                    </span>
                    <span className="text-[10px] font-bold text-primary uppercase">
                      Linked to Policy: Lumbar Surgery Rule v2
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Footer */}
            <div className="p-6 bg-white border-t border-outline-variant/20">
              <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                <span
                  className="material-symbols-outlined"
                  data-icon="rule_folder"
                >
                  rule_folder
                </span>
                Validate Against Policy
              </button>
              <p className="text-center text-[10px] text-on-surface-variant mt-4 font-medium uppercase tracking-tight">
                Results are validated against payer policy in the next step.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClinicalDataExtraction;
