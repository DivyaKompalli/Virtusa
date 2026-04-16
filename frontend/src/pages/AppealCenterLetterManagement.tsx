import React, { useEffect, useMemo, useState } from "react";
import { usePipeline } from "../context/PipelineContext";
import { fetchAppealsData } from "@/lib/api";

type AppealsData = {
  summary: {
    denied_count: number;
    appeal_candidates: number;
    pending_more_info: number;
    recovered_cases: number;
    top_denial_payer: string | null;
  };
  recent_denials: Array<{
    ts: string;
    payer_id: string;
    cpt_codes: string[];
    status: string;
    confidence: number;
  }>;
  payer_breakdown: Record<string, number>;
};

const AppealCenterLetterManagement = () => {
  const { history, latestResult } = usePipeline();
  const [appealsData, setAppealsData] = useState<AppealsData | null>(null);

  useEffect(() => {
    fetchAppealsData()
      .then(setAppealsData)
      .catch((error) => console.error("Failed to load appeals data", error));
  }, [history]);

  const deniedHistory = history
    .filter((run: any) => run.status === "DENIED")
    .reverse();
  const latestAppeal = latestResult?.appeal_letter || null;
  const topPayers = useMemo(
    () => Object.entries(appealsData?.payer_breakdown || {}).sort((a, b) => b[1] - a[1]),
    [appealsData],
  );

  return (
    <>
      {/* Top App Bar */}

      <div className="p-8 max-w-[1440px] mx-auto space-y-8">
        {/* Hero Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Denied Cases Tracked
              </p>
              <h3 className="text-4xl font-extrabold text-cyan-900 tracking-tight">
                {appealsData?.summary.denied_count ?? deniedHistory.length}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <span
                  className="material-symbols-outlined text-sm"
                  data-icon="trending_up"
                >
                  trending_up
                </span>
                <span>
                  Appeal-ready cases: {appealsData?.summary.appeal_candidates ?? deniedHistory.length}
                </span>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <span
                className="material-symbols-outlined text-[200px]"
                data-icon="monetization_on"
              >
                monetization_on
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-tertiary">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              Pending More Info
            </p>
            <h3 className="text-3xl font-extrabold text-cyan-900">
              {appealsData?.summary.pending_more_info ?? 0}
            </h3>
            <div className="mt-4 w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex gap-0.5">
              <div className="h-full bg-tertiary w-[60%]"></div>
              <div className="h-full bg-surface-container-highest flex-1"></div>
            </div>
            <p className="text-[10px] mt-2 text-slate-400 font-medium italic">
              These cases may need documentation before appeal submission.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-error">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              Top Denial Payer
            </p>
            <h3 className="text-3xl font-extrabold text-cyan-900">
              {(appealsData?.summary.top_denial_payer || "n/a").toUpperCase()}
            </h3>
            <p className="text-xs text-error mt-4 font-bold flex items-center gap-1">
              <span
                className="material-symbols-outlined text-sm"
                data-icon="warning"
              >
                warning
              </span>
              Highest denial volume in current history
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recently Denied Requests */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-cyan-900 tracking-tight flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="rule"
                  >
                    rule
                  </span>
                  Recently Denied Requests
                </h2>
                <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                  View All
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Patient &amp; Case ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Procedure
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Denial Reason
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(appealsData?.recent_denials || deniedHistory).map((run: any, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="font-bold text-cyan-900">
                            Case #
                            {run.ts?.split(" ")[0]?.replace(/[^0-9]/g, "") ||
                              Math.floor(Math.random() * 8999) + 1000}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            Submitted: {run.ts || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-slate-700">
                            Service Code
                          </div>
                          <div className="text-[11px] text-slate-400">
                            CPT: {run.cpt_codes?.[0] || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {run.payer_id?.toUpperCase() || "Unknown Payer"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-100 transition-all">
                            Draft Appeal
                          </button>
                        </td>
                      </tr>
                    ))}
                    {deniedHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                          No denied cases in run history yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            {/* Appeal Status Tracking */}
            <section>
              <h2 className="text-lg font-extrabold text-cyan-900 tracking-tight mb-4 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="track_changes"
                >
                  track_changes
                </span>
                Active Appeal Pipeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                      Drafting ({latestAppeal ? 1 : 0})
                    </span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                  </div>
                  <div className="space-y-3">
                    {latestAppeal ? (
                      <div className="bg-white p-3 rounded-lg shadow-sm border-l-2 border-slate-300 hover:shadow-md transition-shadow">
                        <p className="text-xs font-bold text-cyan-900">
                          Latest denied case
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Appeal text generated from current pipeline run
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-lg shadow-sm border-l-2 border-slate-300">
                        <p className="text-xs font-bold text-cyan-900">
                          No active draft
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Run a denied case to generate an appeal letter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-secondary-container/10 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">
                      Top Payers
                    </span>
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  </div>
                  <div className="space-y-3">
                    {topPayers.slice(0, 2).map(([payer, count]) => (
                      <div
                        key={payer}
                        className="bg-white p-3 rounded-lg shadow-sm border-l-2 border-secondary hover:shadow-md transition-shadow"
                      >
                        <p className="text-xs font-bold text-cyan-900 uppercase">
                          {payer}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Denied requests: {count}
                        </p>
                      </div>
                    ))}
                    {topPayers.length === 0 && (
                      <div className="bg-white p-3 rounded-lg shadow-sm border-l-2 border-secondary">
                        <p className="text-xs font-bold text-cyan-900">
                          No denial breakdown yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-tertiary/5 p-4 rounded-xl border border-tertiary/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold text-tertiary uppercase tracking-widest font-manrope">
                      Recovered ({appealsData?.summary.recovered_cases ?? 0})
                    </span>
                    <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border-l-2 border-tertiary hover:shadow-md transition-shadow">
                      <p className="text-xs font-bold text-cyan-900">
                        Approved outcomes
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Successful authorizations tracked from dashboard history
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Side Panel: AI Templates & Context */}
          <aside className="space-y-8">
            <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="material-symbols-outlined text-primary"
                  data-icon="auto_awesome"
                >
                  auto_awesome
                </span>
                <h2 className="text-base font-extrabold text-cyan-900 tracking-tight">
                  AI-Generated Templates
                </h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                    Latest Appeal Output
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-wrap max-h-56 overflow-auto">
                    {latestAppeal || "No appeal letter generated yet. Denied runs will surface a live draft here."}
                  </p>
                </div>
              </div>
            </section>
            <section className="bg-cyan-900 rounded-xl p-6 text-white shadow-lg shadow-cyan-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-manrope font-bold text-sm mb-4">
                  Precision Insight
                </h3>
                <p className="text-cyan-100 text-xs leading-relaxed opacity-90">
                  Appeals filed with{" "}
                  <strong className="text-white">
                    Peer-Reviewed Clinical Trials
                  </strong>{" "}
                  attached have a{" "}
                  <span className="text-tertiary-fixed font-bold">
                    34% higher approval rate
                  </span>{" "}
                  for Oncology cases this month.
                </p>
                <button className="mt-6 text-xs font-bold flex items-center gap-2 text-white hover:translate-x-1 transition-transform">
                  Review evidence database
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span
                  className="material-symbols-outlined text-[64px]"
                  data-icon="lightbulb"
                >
                  lightbulb
                </span>
              </div>
            </section>
            {/* User Workspace Meta */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                Assigned Specialist
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    alt="Specialist avatar"
                    data-alt="portrait of a focused professional woman in a modern healthcare office setting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHr6Ih8SDt_B6KS4EUZY10TBKJYqRsAsVx0WmpmUkF-zkypZAkNzycvsny-mX4F_Q_s36cCc7gm24itYOSZ7H6HlppMue1nmSHcUQzbTreAMLOoryr7shyASJBWHJLVK5h6q8UzPJI6FInThaYrPWFDlLtI02yLwx_Eh1iIrA-EsjYM2uZWW2_HKULhjpAcsQD1ZJK_E3rwQ8goy2Txz-hDF6H1-FOUE3d_YMkzBTBg162Z_Gy38Z-4h_5POKqTgYmGC6jqe33fBE"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-900">
                    Dr. Elena Fisher
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Head of Clinical Appeals
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default AppealCenterLetterManagement;
