import { Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface InputPanelProps {
  payer: string;
  setPayer: (v: string) => void;
  inputMode: "csv" | "ehr";
  setInputMode: (v: "csv" | "ehr") => void;
  ehrNote: string;
  setEhrNote: (v: string) => void;
  csvPatient: number;
  setCsvPatient: (v: number) => void;
  forceDenial: boolean;
  setForceDenial: (v: boolean) => void;
  saveOutputs: boolean;
  setSaveOutputs: (v: boolean) => void;
  scenario: string;
  setScenario: (v: string) => void;
  scenarios: string[];
  onRun: () => void;
  isRunning: boolean;
}

export const InputPanel = ({
  payer, setPayer,
  inputMode, setInputMode,
  ehrNote, setEhrNote,
  csvPatient, setCsvPatient,
  forceDenial, setForceDenial,
  saveOutputs, setSaveOutputs,
  scenario, setScenario,
  scenarios,
  onRun, isRunning,
}: InputPanelProps) => {
  return (
    <div className="glass-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-foreground">Prior Auth</h2>
        <p className="text-xs text-muted-foreground">v3.0 · Autonomous Agent Pipeline</p>
      </div>

      <div className="space-y-4">
        {/* Payer */}
        <div>
          <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payer</Label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="aetna">Aetna</option>
            <option value="cigna">Cigna</option>
            <option value="uhc">UHC</option>
            <option value="payer_a">PAYER_A (Demo → Aetna)</option>
          </select>
        </div>

        {/* Input Mode Toggle */}
        <div>
          <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clinical Reader Input</Label>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["csv", "ehr"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  inputMode === mode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "csv" ? "CSV Patient" : "EHR Note"}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles Row */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <input
              type="checkbox"
              checked={forceDenial}
              onChange={(e) => setForceDenial(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-destructive"
            />
            <span className="text-xs font-medium text-foreground">Force Denial</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <input
              type="checkbox"
              checked={saveOutputs}
              onChange={(e) => setSaveOutputs(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            <span className="text-xs font-medium text-foreground">Save Outputs</span>
          </label>
        </div>

        {/* Scenario */}
        <div>
          <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sample Scenario</Label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {scenarios.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        {inputMode === "ehr" ? (
          <div>
            <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              EHR Documentation
            </Label>
            <textarea
              value={ehrNote}
              onChange={(e) => setEhrNote(e.target.value)}
              placeholder="Paste EHR note here. Leave blank to use sample scenario."
              className="h-44 w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ) : (
          <div>
            <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient ID / Row</Label>
            <input
              type="number"
              value={csvPatient}
              onChange={(e) => setCsvPatient(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {/* Run Button */}
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="w-full gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          {isRunning ? (
            <>
              <Zap className="h-4 w-4 animate-pulse" /> Running Agents…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Run All Agents
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
