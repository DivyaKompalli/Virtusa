interface CodeChipsProps {
  codes: Record<string, string[]>;
}

const chipStyles: Record<string, string> = {
  icd10: "bg-primary/10 text-primary border-primary/20",
  cpt: "bg-accent/10 text-accent border-accent/20",
  hcpcs: "bg-warning/10 text-warning border-warning/20",
  loinc: "bg-success/10 text-success border-success/20",
};

export const CodeChips = ({ codes }: CodeChipsProps) => {
  const codeTypes = ["icd10", "cpt", "hcpcs", "loinc"] as const;

  return (
    <div className="space-y-3">
      {codeTypes.map((type) => {
        const vals = codes[type];
        if (!vals || vals.length === 0) return null;
        const style = chipStyles[type] || "bg-muted text-muted-foreground border-border";
        return (
          <div key={type}>
            <div className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
              {type.toUpperCase().replace("10", "-10")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {vals.map((c) => (
                <span
                  key={c}
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] font-semibold ${style}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
