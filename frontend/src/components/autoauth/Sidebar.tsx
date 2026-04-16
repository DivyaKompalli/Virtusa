import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MetricsData {
  totalRuns: number;
  approvals: number;
  denials: number;
  pending: number;
  errors: number;
  daysSaved: number;
}

interface PayerStat {
  payerId: string;
  runs: number;
  approved: number;
  approvalRate: number;
}

interface RecentRun {
  payerId: string;
  cpt: string;
  status: "APPROVED" | "DENIED" | "PENDING";
}

interface SidebarProps {
  metrics: MetricsData;
  payerStats: PayerStat[];
  recentRuns: RecentRun[];
  onReset: () => void;
}

const MetricTile = ({ label, value, accent }: { label: string; value: string | number; accent?: string }) => (
  <div className="rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
    <div className={`font-mono text-lg font-bold ${accent || "text-sidebar-foreground"}`}>{value}</div>
    <div className="text-[0.65rem] font-medium uppercase tracking-wider text-sidebar-muted">{label}</div>
  </div>
);

const PayerBar = ({ stat }: { stat: PayerStat }) => {
  const pct = Math.round(stat.approvalRate * 100);
  const color = pct >= 70 ? "bg-success" : pct >= 40 ? "bg-warning" : "bg-destructive";
  const textColor = pct >= 70 ? "text-success" : pct >= 40 ? "text-warning" : "text-destructive";

  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-sidebar-muted">
          {stat.payerId}
        </span>
        <span className={`font-mono text-xs font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sidebar-accent/50">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const RunBadge = ({ status }: { status: string }) => {
  const config = {
    APPROVED: { label: "✓ APPR", cls: "bg-success/15 text-success border-success/30" },
    DENIED: { label: "✗ DENY", cls: "bg-destructive/15 text-destructive border-destructive/30" },
    PENDING: { label: "⚑ PEND", cls: "bg-warning/15 text-warning border-warning/30" },
  }[status] || { label: "?", cls: "bg-muted/15 text-sidebar-muted border-sidebar-border" };

  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[0.6rem] font-semibold ${config.cls}`}>
      {config.label}
    </span>
  );
};

export const Sidebar = ({ metrics, payerStats, recentRuns, onReset }: SidebarProps) => {
  return (
    <aside className="flex h-screen w-72 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">
          Auto<span className="text-sidebar-primary">Auth</span>
        </h1>
        <p className="mt-0.5 text-[0.7rem] font-medium text-sidebar-muted">Prior Authorization Intelligence</p>
      </div>

      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Revenue Dashboard */}
      <div className="sidebar-section">
        <h3 className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-sidebar-muted">
          Revenue Dashboard
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <MetricTile label="Total Runs" value={metrics.totalRuns} />
          <MetricTile label="Approvals" value={metrics.approvals} accent="text-success" />
          <MetricTile label="Denials" value={metrics.denials} accent="text-destructive" />
          <MetricTile label="Pending" value={metrics.pending} accent="text-warning" />
          <MetricTile label="Errors" value={metrics.errors} />
          <MetricTile label="Days Saved" value={`${metrics.daysSaved.toFixed(1)}d`} accent="text-sidebar-primary" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="mt-2 w-full text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 text-xs"
        >
          <RotateCcw className="mr-1.5 h-3 w-3" /> Reset Metrics
        </Button>
      </div>

      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Payer Behavior */}
      <div className="sidebar-section">
        <h3 className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-sidebar-muted">
          Payer Approval Rates
        </h3>
        {payerStats.length > 0 ? (
          payerStats.map((s) => <PayerBar key={s.payerId} stat={s} />)
        ) : (
          <p className="text-xs text-sidebar-muted">No data yet</p>
        )}
      </div>

      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Recent Runs */}
      <div className="sidebar-section flex-1">
        <h3 className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-sidebar-muted">
          Recent Runs
        </h3>
        {recentRuns.length > 0 ? (
          <div className="space-y-1.5">
            {recentRuns.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-sidebar-accent/30 px-3 py-2 transition-colors hover:bg-sidebar-accent/60"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.65rem] font-bold text-sidebar-foreground">{r.payerId.toUpperCase()}</span>
                  <span className="font-mono text-[0.6rem] text-sidebar-muted">{r.cpt}</span>
                </div>
                <RunBadge status={r.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-sidebar-muted">No runs yet</p>
        )}
      </div>
    </aside>
  );
};
