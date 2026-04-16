import React from "react";
import { usePipeline } from "../context/PipelineContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthorizationStatusDecisionDetail = () => {
  const { latestResult } = usePipeline();
  const navigate = useNavigate();

  if (!latestResult) {
    return (
      <div className="p-8 text-center max-w-7xl mx-auto mt-20">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
          hourglass_empty
        </span>
        <h2 className="text-2xl font-bold text-slate-600 mb-2">
          No active decision
        </h2>
        <p className="text-slate-500 mb-6">
          Run a pipeline in the dashboard to view details.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { pa_decision, pipeline_summary } = latestResult;
  const decision = pa_decision?.decision;
  const statusColor =
    decision === "APPROVED"
      ? "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20"
      : decision === "DENIED"
        ? "bg-error-container text-on-error-container border-error/20"
        : "bg-secondary-fixed text-on-secondary-fixed border-secondary/20";
  const statusIcon =
    decision === "APPROVED"
      ? "check_circle"
      : decision === "DENIED"
        ? "cancel"
        : "hourglass_top";

  const handleDownloadPdf = () => {
    if (latestResult?.filled_form_base64) {
      const linkSource = `data:application/pdf;base64,${latestResult.filled_form_base64}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = "PA_Decision_Form.pdf";
      downloadLink.click();
    } else {
      toast.error(
        latestResult?.filled_form_error || "Filled PA request form is not available.",
      );
    }
  };

  return (
    <>
      {/* TopAppBar (Shared Component) */}

      {/* Page Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Status Section (Asymmetric Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest font-label">
                Case ID: AUTH-{Math.floor(Math.random() * 8999) + 1000}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium">Submitted Just Now</span>
            </div>
            <h2 className="text-3xl font-extrabold text-on-surface font-headline leading-tight">
              Prior Authorization: CPT {pipeline_summary?.cpt_code || "Unknown"}
            </h2>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Request for advanced medical services regarding specific
              diagnostics and treatment for the patient matching given clinical
              notes.
            </p>
          </div>
          <div className="flex flex-col justify-center items-end">
            <div
              className={`inline-flex items-center px-6 py-3 rounded-full shadow-sm border ${statusColor}`}
            >
              <span
                className="material-symbols-outlined mr-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {statusIcon}
              </span>
              <span className="text-xl font-black uppercase tracking-tighter font-headline">
                {pa_decision?.decision || "UNKNOWN"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Final Decision reached via AutoAuth Agent
            </p>
          </div>
        </div>
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Decision Rationale Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Audit Trail / Rationale Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    gavel
                  </span>
                  Decision Rationale &amp; Clinical Compliance
                </h3>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  Download full PDF
                </button>
              </div>
              <div className="space-y-8">
                {/* Rationale Block 1 */}
                <div className="relative pl-8 border-l-2 border-primary/20 pb-4">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-on-surface">
                      Payer Policy Agent Rationale
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {pa_decision?.reason ||
                        "No rationale provided by the agent."}
                    </p>
                    <div className="inline-block px-2 py-1 bg-surface-container-low rounded text-[10px] font-bold text-secondary uppercase tracking-tight">
                      AI Generated Rationale
                    </div>
                  </div>
                </div>
                {/* Rationale Block 2 */}
                {pa_decision?.criteria_missing &&
                  pa_decision.criteria_missing.length > 0 && (
                    <div className="relative pl-8 border-l-2 border-primary/20 pb-4">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-error flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-error">
                          Missing Criteria Identified
                        </h4>
                        <ul className="text-sm text-on-surface-variant leading-relaxed list-disc pl-4">
                          {pa_decision.criteria_missing.map(
                            (c: string, i: number) => (
                              <li key={i}>{c}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                {/* Rationale Block 3 */}
                <div className="relative pl-8 border-l-2 border-primary/10">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-on-surface">
                      Secondary Review (Optional)
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      "Patient exhibits specific lumbar focal weakness and
                      positive straight-leg raise. Imaging is warranted to guide
                      possible interventional or surgical management."
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200">
                        <img
                          alt="Reviewer"
                          className="h-full w-full rounded-full object-cover"
                          data-alt="close up of a professional male doctor in a lab coat, neutral background, clinical precision"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsz93tBmXpcFVtQoskITq5LaZ-_QWTnRxCW3CjGOpVg648EppQPocA1Wgz9btyaKp-G6G4SnPGgPg-FQlPT-oBd44oBccHdnB-iGaKVtv2qIOPFcahc86MNBskVVh_I-CUc5FXZRWn0F4NQyrtwqLB-v3kGiA3YObYuqcEHGnfzas6EJZ1rnbydo5DleZ3hntPxNYMpd0VVb8o4T1xBhOEA2Um4H9XjprPmq5SVOJjmSLttDOI7iLXnkO7SpXzkOukUh_ygWynle0"
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        Dr. S. Vance, Board Certified Orthopedist
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Clinician Notes Section */}
            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-label uppercase tracking-widest text-secondary">
                  Clinician Worknotes
                </h3>
                <span className="text-xs text-slate-400">
                  Restricted Access • Internal Only
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-outline-variant/20 min-h-[120px]">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  Note added by Nurse Reviewer: "Confirmed with provider office
                  that PT was completed twice weekly for 8 weeks. Initial
                  request lacked the PT discharge summary; obtained via fax
                  03/13. Guidelines now fully met."
                </p>
              </div>
            </div>
          </div>
          {/* Action Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* PDF Summary Card */}
            <div className="bg-primary rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-9xl">
                  picture_as_pdf
                </span>
              </div>
              <h4 className="text-lg font-bold font-headline mb-2">
                Final Determination
              </h4>
              <p className="text-sm text-primary-fixed/80 mb-6 leading-snug">
                The official determination letter is ready for your records.
                This includes the authorization number and validity dates.
              </p>
              <button
                onClick={handleDownloadPdf}
                className="w-full bg-white text-primary py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-95 duration-150"
              >
                <span className="material-symbols-outlined text-base">
                  cloud_download
                </span>
                Download Decision PDF
              </button>
            </div>
            {/* Authorization Details Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Service Authorization
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Auth Number</span>
                  <span className="text-sm font-bold font-mono">
                    #9822104-M
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Effective Date</span>
                  <span className="text-sm font-bold">Mar 14, 2024</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Expiration</span>
                  <span className="text-sm font-bold">Jun 14, 2024</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-500">Service Units</span>
                  <span className="text-sm font-bold">1 Study</span>
                </div>
              </div>
            </div>
            {/* Alternative Actions (Appeal focus if it were denied) */}
            <div className="bg-surface-container-high/50 rounded-xl p-6 border border-dashed border-outline-variant/50">
              <h4 className="text-xs font-bold text-on-surface-variant mb-4">
                Post-Decision Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 border border-outline-variant/20 text-xs font-bold text-slate-600 hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    share
                  </span>
                  Notify Provider via Portal
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 border border-outline-variant/20 text-xs font-bold text-slate-600 hover:bg-white transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    history_edu
                  </span>
                  View Revision History
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-error-container/20 border border-error/10 text-xs font-bold text-error hover:bg-error-container/30 transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    cancel
                  </span>
                  Void Authorization
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Audit Trail Footer */}
        <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
          <p className="text-[10px] text-slate-400 font-label tracking-widest uppercase">
            Certified Digital Audit Log Timestamp: 2024-03-14T09:42:12Z-UTC
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthorizationStatusDecisionDetail;
