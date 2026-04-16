import React, { useEffect, useMemo, useState } from "react";
import { fetchPolicyLibraryData } from "@/lib/api";

type PolicyRecord = {
  payer_id: string;
  payer_name: string;
  policy_count: number;
  vector_file_count: number;
  status: string;
  last_updated: string | null;
  latest_assets: string[];
};

type PolicyLibraryResponse = {
  policies: PolicyRecord[];
  store_health: {
    status: string;
    total_policy_files: number;
    total_vector_files: number;
    indexed_payers: number;
    alert: string | null;
  };
};

const badgeClass = (status: string) => {
  if (status === "Indexed") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }
  if (status === "Pending Ingestion") {
    return "bg-secondary-fixed text-on-secondary-fixed";
  }
  return "bg-error-container text-on-error-container";
};

const PolicyLibraryIngestion = () => {
  const [data, setData] = useState<PolicyLibraryResponse | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchPolicyLibraryData()
      .then(setData)
      .catch((error) => console.error("Failed to load policy library data", error));
  }, []);

  const filteredPolicies = useMemo(() => {
    const policies = [...(data?.policies || [])]
      .filter((policy) =>
        policy.payer_name.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .filter((policy) =>
        statusFilter === "All" ? true : policy.status === statusFilter,
      );

    if (sortBy === "updated") {
      policies.sort(
        (a, b) =>
          new Date(b.last_updated || 0).getTime() -
          new Date(a.last_updated || 0).getTime(),
      );
    } else {
      policies.sort((a, b) => a.payer_name.localeCompare(b.payer_name));
    }

    return policies;
  }, [data, search, sortBy, statusFilter]);

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary mb-2">
            Policy Library
          </h2>
          <p className="text-secondary font-medium">
            Backend-backed payer policy inventory and vector store readiness.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-end items-end">
          <div className="rounded-md border border-outline-variant/20 px-4 py-3 text-sm text-slate-600 bg-surface-container-lowest">
            Indexed payers:{" "}
            <span className="font-bold text-primary">
              {data?.store_health.indexed_payers ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm font-medium"
                placeholder="Filter by payer name..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-secondary focus:ring-0"
            >
              <option value="All">All Statuses</option>
              <option value="Indexed">Indexed</option>
              <option value="Pending Ingestion">Pending Ingestion</option>
              <option value="No Policies">No Policies</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-secondary focus:ring-0"
            >
              <option value="name">Sort by Name</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Payer Organization
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Policy Files
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Vector Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPolicies.map((policy) => (
                  <tr
                    key={policy.payer_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary font-bold uppercase">
                          {policy.payer_id.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">
                            {policy.payer_name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Vector files: {policy.vector_file_count}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {policy.policy_count}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {policy.last_updated || "Not available"}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass(policy.status)}`}
                      >
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredPolicies.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      No policy records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-6">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">upload_file</span>
              Upload New Policy
            </h3>
            <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-8 text-center">
              <p className="text-sm font-bold text-on-surface mb-1">
                Policy upload is not wired yet
              </p>
              <p className="text-xs text-slate-500">
                This view now reflects live backend inventory. Upload/ingestion can
                be added next through a dedicated endpoint.
              </p>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary">
                  Vector Store Health
                </h3>
                <p className="text-xs text-secondary">
                  Derived from backend file inventory
                </p>
              </div>
              <span
                className={`px-2 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-tighter ${
                  data?.store_health.status === "Operational"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {data?.store_health.status || "Loading"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-3 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Policy Files
                </div>
                <div className="text-xl font-extrabold text-primary tracking-tight">
                  {data?.store_health.total_policy_files ?? 0}
                </div>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Vector Files
                </div>
                <div className="text-xl font-extrabold text-primary tracking-tight">
                  {data?.store_health.total_vector_files ?? 0}
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-on-surface mb-3 uppercase tracking-wider">
                Store Alerts
              </h4>
              <div className="flex gap-3 items-start text-xs p-3 rounded-lg bg-surface-container-low">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  info
                </span>
                <p className="text-on-surface-variant">
                  {data?.store_health.alert || "Vector store is present for at least one payer."}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-cyan-900 rounded-xl p-6 text-white shadow-lg shadow-cyan-900/20">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-1 block">
              Semantic Coverage
            </span>
            <h4 className="font-bold">Current Library Snapshot</h4>
            <p className="text-white/70 text-xs mt-2">
              {data?.policies.some((policy) => policy.status === "Indexed")
                ? "Indexed payer stores are available for policy retrieval."
                : "No indexed payer stores found yet. Ingest payer documents to enable retrieval-backed decisions."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PolicyLibraryIngestion;
