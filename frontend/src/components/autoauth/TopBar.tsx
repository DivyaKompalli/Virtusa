export const TopBar = () => (
  <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
    <div className="flex items-center gap-2">
      <span className="text-base font-bold text-foreground">
        Auto<span className="text-primary">Auth</span>
      </span>
      <span className="text-muted-foreground">/</span>
      <span className="text-sm text-muted-foreground">Prior Authorization Pipeline</span>
    </div>
    <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/5 px-3 py-1">
      <span className="pulse-dot" />
      <span className="text-xs font-semibold text-success">AI Agents Active</span>
    </div>
  </header>
);
