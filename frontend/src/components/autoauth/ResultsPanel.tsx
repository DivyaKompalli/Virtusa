import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepCard } from "./StepCard";
import { DecisionHero } from "./DecisionHero";
import { CodeChips } from "./CodeChips";

interface ResultsPanelProps {
  result: any | null;
  onGenerateAppeal: () => void;
  appealLetter: string | null;
}

const EmptyState = () => (
  <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-4xl">⚕</div>
    <h3 className="text-lg font-bold text-foreground">Configure & Run Agents</h3>
    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
      Select a payer, choose a scenario, and click <strong>Run All Agents</strong> to begin.
    </p>
  </div>
);

export const ResultsPanel = ({ result, onGenerateAppeal, appealLetter }: ResultsPanelProps) => {
  if (!result) return <EmptyState />;

  const clinical = result.clinical_bundle || {};
  const paDecision = result.pa_decision || {};
  const decision = paDecision.decision || "";
  const codes = clinical.codes || {};
  const summary = clinical.patient_summary || clinical.summary || "";
  const evidence = Array.isArray(clinical.supporting_evidence)
    ? clinical.supporting_evidence
    : clinical.supporting_evidence
    ? [String(clinical.supporting_evidence)]
    : [];
  const confPct = Math.round((clinical.confidence || 0) * 100);
  const method = clinical.extraction_method || "EHR NLP extraction";
  const hasError = !!clinical.error;

  const critMet = paDecision.criteria_met || [];
  const critMissing = paDecision.criteria_missing || [];
  const sources = paDecision.policy_sources || [];
  const hint = paDecision.appeal_hint;
  const pre = paDecision.pre_submission_risk || {};
  const estDays = decision === "APPROVED" ? 3.0 : decision === "DENIED" ? 1.0 : 0.5;
  const canAppeal = decision === "DENIED";

  return (
    <div className="space-y-4">
      {/* Step 1 */}
      <StepCard
        stepNum="STEP 01 / 03"
        title="Clinical Reader Agent"
        icon="🔬"
        status={hasError ? "error" : "complete"}
        className="animate-fade-in-up"
      >
        {hasError ? (
          <p className="font-mono text-xs text-destructive">{clinical.error}</p>
        ) : (
          <>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1">
              <span className="pulse-dot" />
              <span className="font-mono text-[0.65rem] font-semibold text-accent">
                AI Confidence: {confPct}% · {method}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="mb-2 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
                  Extracted Medical Codes
                </div>
                <CodeChips codes={codes} />
              </div>
              <div>
                <div className="mb-2 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
                  Clinical Summary
                </div>
                <div className="mb-3 rounded-lg border-l-2 border-accent bg-accent/5 px-3 py-2 text-xs leading-relaxed text-foreground/80">
                  {summary}
                </div>
                {evidence.length > 0 && (
                  <>
                    <div className="mb-2 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
                      Supporting Evidence
                    </div>
                    <div className="space-y-1.5">
                      {evidence.slice(0, 5).map((e: string, i: number) => (
                        <div key={i} className="rounded-lg border-l-2 border-primary/30 bg-primary/5 px-3 py-2 text-xs text-foreground/80">
                          {e}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </StepCard>

      {/* Step 2 */}
      <StepCard
        stepNum="STEP 02 / 03"
        title="Policy Intelligence Agent"
        icon="🏛️"
        status={decision === "ERROR" ? "error" : "complete"}
        className="animate-fade-in-up stagger-1"
      >
        <DecisionHero
          decision={decision}
          confidence={paDecision.confidence || 0}
          preScore={pre.approval_probability ?? "—"}
          riskLevel={pre.risk_level ?? "—"}
          daysSaved={estDays}
          reason={paDecision.reason || ""}
        />

        {(critMet.length > 0 || critMissing.length > 0) && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {critMet.length > 0 && (
              <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                <div className="mb-2 text-[0.65rem] font-bold text-success">✓ Criteria Met</div>
                {critMet.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-1.5 py-0.5 text-xs text-foreground/80">
                    <span className="font-bold text-success">✓</span> {c}
                  </div>
                ))}
              </div>
            )}
            {critMissing.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <div className="mb-2 text-[0.65rem] font-bold text-destructive">✗ Criteria Missing</div>
                {critMissing.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-1.5 py-0.5 text-xs text-foreground/80">
                    <span className="font-bold text-destructive">✗</span> {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
              Policy Sources Matched
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((s: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-[0.65rem] text-foreground/80">
                  <FileText className="h-3 w-3 text-destructive" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {hint && (
          <div className="mt-4 flex gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3">
            <span className="text-base">💡</span>
            <div>
              <div className="text-xs font-bold text-warning">Appeal Guidance</div>
              <div className="mt-0.5 text-xs text-foreground/80">{hint}</div>
            </div>
          </div>
        )}
      </StepCard>

      {/* Step 3 */}
      <StepCard
        stepNum="STEP 03 / 03"
        title={canAppeal ? "Appeal Letter Agent" : "Submission Agent"}
        icon={canAppeal ? "📝" : "📬"}
        status={canAppeal || decision === "APPROVED" ? "complete" : "waiting"}
        className="animate-fade-in-up stagger-2"
      >
        <div className="mb-3 font-mono text-[0.65rem] text-muted-foreground">
          Request ID: <code className="rounded bg-secondary px-1.5 py-0.5 font-semibold text-foreground">PA-{Math.random().toString(36).slice(2, 10).toUpperCase()}</code>
        </div>

        {decision === "APPROVED" && (
          <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
            ✓ Submit electronically. Case is <strong>APPROVED</strong>.
          </div>
        )}
        {decision === "DENIED" && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            ✗ Case is <strong>DENIED</strong>. Generate appeal letter and attach missing documentation.
          </div>
        )}
        {decision === "PENDING_MORE_INFO" && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-sm font-medium text-warning">
            ⚑ Manual check required. Provide missing documentation and re-run.
          </div>
        )}

        {canAppeal && (
          <div className="mt-4">
            <Button
              onClick={onGenerateAppeal}
              variant="outline"
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Sparkles className="h-4 w-4" /> Generate Appeal Letter
            </Button>
            {appealLetter && (
              <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-secondary p-4 font-mono text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
                {appealLetter}
              </div>
            )}
          </div>
        )}
      </StepCard>
    </div>
  );
};
