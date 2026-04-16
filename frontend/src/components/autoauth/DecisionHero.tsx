interface DecisionHeroProps {
  decision: string;
  confidence: number;
  preScore: string;
  riskLevel: string;
  daysSaved: number;
  reason: string;
}

export const DecisionHero = ({ decision, confidence, preScore, riskLevel, daysSaved, reason }: DecisionHeroProps) => {
  const config = {
    APPROVED: { verdict: "✓ APPROVED", border: "border-success/40", glow: "glow-success", textCls: "text-success", bg: "bg-success/5" },
    DENIED: { verdict: "✗ DENIED", border: "border-destructive/40", glow: "glow-destructive", textCls: "text-destructive", bg: "bg-destructive/5" },
    PENDING_MORE_INFO: { verdict: "⚑ PENDING", border: "border-warning/40", glow: "glow-primary", textCls: "text-warning", bg: "bg-warning/5" },
  }[decision] || { verdict: "⚠ ERROR", border: "border-border", glow: "", textCls: "text-muted-foreground", bg: "bg-muted" };

  const riskColor = riskLevel === "LOW" ? "text-success" : riskLevel === "HIGH" ? "text-destructive" : "text-warning";
  const confBarColor = decision === "APPROVED" ? "bg-success" : decision === "DENIED" ? "bg-destructive" : "bg-warning";

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} ${config.glow} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">Authorization Decision</div>
          <div className={`mt-1 text-2xl font-extrabold tracking-tight ${config.textCls}`}>{config.verdict}</div>
        </div>
        <div className="flex flex-wrap gap-5">
          <KPI label="Pre-Score" value={preScore !== "—" ? `${preScore}%` : "—"} />
          <div>
            <KPI label="AI Confidence" value={`${confidence}%`} />
            <div className="mt-1 h-1 w-16 overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${confBarColor} transition-all duration-700`} style={{ width: `${confidence}%` }} />
            </div>
          </div>
          <KPI label="Risk Level" value={riskLevel} valueClass={riskColor} />
          <KPI label="Days Saved" value={`${daysSaved.toFixed(1)}d`} />
        </div>
      </div>
      {reason && (
        <div className={`mt-4 rounded-lg border ${config.border} ${config.bg} px-4 py-3 text-xs leading-relaxed text-foreground/80`}>
          {reason}
        </div>
      )}
    </div>
  );
};

const KPI = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="text-center">
    <div className={`font-mono text-base font-bold ${valueClass || "text-foreground"}`}>{value}</div>
    <div className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);
