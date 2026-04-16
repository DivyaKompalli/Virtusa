import React, { useState } from "react";
import { toast } from "sonner";
import { usePipeline } from "../context/PipelineContext";
import { useNavigate } from "react-router-dom";
import { runPipeline } from "@/lib/api";

const PriorAuthorizationDashboard = () => {
  const { metrics, history, setLatestResult, refreshDashboardData } =
    usePipeline();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ehrNote, setEhrNote] = useState("");
  const [payer, setPayer] = useState("aetna");
  const [inputMode, setInputMode] = useState<"EHR Note" | "CSV Patient">(
    "EHR Note",
  );
  const [patientId, setPatientId] = useState(1);
  const [forceDenial, setForceDenial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunPipeline = async () => {
    if (inputMode === "EHR Note" && !ehrNote.trim()) {
      toast.error("Please enter an EHR Note");
      return;
    }
    setIsLoading(true);
    try {
      const data = await runPipeline({
        input_mode: inputMode,
        ehr_note: inputMode === "EHR Note" ? ehrNote : undefined,
        csv_patient: inputMode === "CSV Patient" ? patientId : undefined,
        payer,
        force_denial: forceDenial,
      });
      setLatestResult(data);
      refreshDashboardData();
      setIsModalOpen(false);
      toast.success("Pipeline executed successfully!");
      navigate("/decision");
    } catch (e) {
      toast.error("Could not connect to FastAPI backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* TopAppBar Anchor */}

      {/* Dashboard Canvas */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header & Quick Action */}
        <section className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-extrabold text-primary font-headline tracking-tight">
              Authorization Dashboard
            </h3>
            <p className="text-secondary font-body mt-1">
              Real-time clinical review oversight and performance metrics.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-md font-manrope font-bold text-sm shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-150"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              add
            </span>
            New Authorization Request
          </button>
        </section>
        {/* Bento Grid: Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Requests */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-label">
                Total Requests
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {metrics.total_runs.toLocaleString()}
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{" "}
              +12%
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none">
              analytics
            </span>
          </div>
          {/* Approval Rate */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-label">
                Approval Rate
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {metrics.total_runs > 0
                  ? ((metrics.approvals / metrics.total_runs) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-tertiary-fixed-dim rounded-full"
                style={{
                  width: `${metrics.total_runs > 0 ? (metrics.approvals / metrics.total_runs) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none">
              verified
            </span>
          </div>
          {/* Avg Processing Time */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-label">
                Days Saved
              </p>
              <p className="text-3xl font-black text-on-surface mt-1">
                {metrics.cumulative_days_saved.toFixed(1)}
                <span className="text-lg font-medium text-slate-400 ml-1">
                  d
                </span>
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-cyan-600 bg-cyan-50 w-fit px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">timer</span>{" "}
              Within SLA
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none">
              schedule
            </span>
          </div>
          {/* Pending Reviews */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-label">
                Pending / Manual
              </p>
              <p className="text-3xl font-black text-primary-container mt-1">
                {metrics.pending_more_info + metrics.errors}
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">
                priority_high
              </span>{" "}
              8 Urgent
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none">
              pending_actions
            </span>
          </div>
        </section>
        {/* Data Table Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-bold text-on-surface font-headline">
                Recent Authorization Requests
              </h4>
              <p className="text-sm text-slate-500 font-body">
                Showing the latest 15 transactions across all payers.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant/20 rounded-md hover:bg-slate-50 text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  filter_list
                </span>
              </button>
              <button className="p-2 border border-outline-variant/20 rounded-md hover:bg-slate-50 text-slate-600 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  download
                </span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label">
                    Patient ID
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label">
                    Date Submitted
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label">
                    Payer
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label">
                    Service Type
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label">
                    Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-label text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body">
                {history
                  .slice(-5)
                  .reverse()
                  .map((run, idx) => {
                    let statusColor = "bg-slate-100 text-slate-600";
                    if (run.status === "APPROVED")
                      statusColor = "bg-tertiary-fixed text-on-tertiary-fixed";
                    else if (run.status === "DENIED")
                      statusColor =
                        "bg-error-container text-on-error-container";
                    else if (run.status === "PENDING_MORE_INFO")
                      statusColor =
                        "bg-secondary-fixed text-on-secondary-fixed";

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">
                              #{run.cpt_codes[0] || "PA"}
                            </span>
                            <span className="text-xs text-slate-400">
                              Patient
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-600">
                          {run.ts}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-600 font-medium uppercase">
                          {run.payer_id}
                        </td>
                        <td className="px-8 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tighter">
                            Code {run.cpt_codes[0] || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusColor}`}
                          >
                            {run.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="text-primary hover:text-primary-container font-bold text-xs">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {history.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-4 text-center text-sm text-slate-400"
                    >
                      No recent authorizations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-surface-container border-t border-outline-variant/10 flex justify-between items-center">
            <p className="text-xs text-slate-500 font-body">
              Showing 1 to 5 of 1,284 entries
            </p>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/20 text-slate-400 hover:bg-slate-100 transition-colors cursor-not-allowed">
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/20 text-slate-600 text-xs font-bold hover:bg-slate-50">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/20 text-slate-600 text-xs font-bold hover:bg-slate-50">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/20 text-slate-600 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
        {/* Bottom Asymmetric Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Payer Distribution */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-bold text-on-surface font-headline">
                  Submission Volume by Payer
                </h4>
                <p className="text-sm text-slate-500 font-body">
                  Historical data over the last 30 days.
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded">
                Last 30 Days
              </span>
            </div>
            <div className="space-y-6">
              {/* Chart Mock */}
              <div className="h-48 w-full flex items-end gap-2 px-2">
                <div className="flex-1 bg-primary/20 h-[40%] rounded-t-sm hover:bg-primary/40 transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    BCBS: 412
                  </div>
                </div>
                <div className="flex-1 bg-primary/20 h-[65%] rounded-t-sm hover:bg-primary/40 transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Aetna: 680
                  </div>
                </div>
                <div className="flex-1 bg-primary/40 h-[85%] rounded-t-sm hover:bg-primary/60 transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    UHC: 912
                  </div>
                </div>
                <div className="flex-1 bg-primary/20 h-[55%] rounded-t-sm hover:bg-primary/40 transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Cigna: 540
                  </div>
                </div>
                <div className="flex-1 bg-primary/30 h-[70%] rounded-t-sm hover:bg-primary/50 transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Humana: 720
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <span>BCBS</span>
                <span>Aetna</span>
                <span>UHC</span>
                <span>Cigna</span>
                <span>Humana</span>
              </div>
            </div>
          </div>
          {/* Recent Activity Feed */}
          <div className="bg-surface-container-high p-8 rounded-xl flex flex-col h-full border border-outline-variant/5">
            <h4 className="text-lg font-bold text-on-surface font-headline mb-6">
              Workflow Activity
            </h4>
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center z-10 relative">
                    <span className="material-symbols-outlined text-sm text-on-tertiary-fixed">
                      check
                    </span>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-outline-variant/30"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    Authorization Approved
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    #PA-9021 by BlueCross (MRI)
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                    12 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center z-10 relative">
                    <span className="material-symbols-outlined text-sm text-on-secondary-fixed">
                      assignment_return
                    </span>
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-outline-variant/30"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    Information Requested
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Aetna requested clinical notes for #PA-8842
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                    45 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center z-10 relative">
                    <span className="material-symbols-outlined text-sm text-on-primary-fixed">
                      add
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    New Request Submitted
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dr. Vance submitted #PA-9104 to Cigna
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-2 border border-primary/20 rounded text-primary text-xs font-bold hover:bg-primary/5 transition-colors">
              View Audit Log
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl p-8 border border-outline-variant/20 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary font-headline">
                New Authorization Request
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Payer
                </label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="aetna">Aetna</option>
                  <option value="uhc">United Healthcare</option>
                  <option value="cigna">Cigna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Input Mode
                </label>
                <select
                  value={inputMode}
                  onChange={(e) => setInputMode(e.target.value as any)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="EHR Note">EHR Note</option>
                  <option value="CSV Patient">CSV Patient</option>
                </select>
              </div>
              {inputMode === "EHR Note" ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    EHR Provider Documentation
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Provide the patient's clinical notes, relevant medical
                    history, and proposed procedure details. The AI agent will
                    extract necessary ICD-10 and CPT codes from this text.
                  </p>
                  <textarea
                    value={ehrNote}
                    onChange={(e) => setEhrNote(e.target.value)}
                    placeholder="Example: Patient is a 45yo male presenting with chronic lower back pain. MRI shows L4-L5 disc herniation. Recommending Lumbar Laminectomy (CPT 63030)..."
                    className="w-full bg-slate-50 border border-outline-variant/30 rounded-lg p-4 h-48 text-sm focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Patient ID (from CSV)
                  </label>
                  <input
                    type="number"
                    value={patientId}
                    onChange={(e) => setPatientId(Number(e.target.value))}
                    className="w-full bg-surface border border-outline-variant/30 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg border border-outline-variant/20 px-3 py-2">
                <div>
                  <p className="text-sm font-bold text-slate-700">Force Denial</p>
                  <p className="text-xs text-slate-500">Useful for appeal workflow demos.</p>
                </div>
                <input
                  type="checkbox"
                  checked={forceDenial}
                  onChange={(e) => setForceDenial(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRunPipeline}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">
                      refresh
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">
                      rocket_launch
                    </span>
                  )}
                  {isLoading ? "Running Agents..." : "Run Pipeline"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PriorAuthorizationDashboard;
