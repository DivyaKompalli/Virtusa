import { ReactNode } from "react";

interface StepCardProps {
  stepNum: string;
  title: string;
  icon: string;
  status: "complete" | "error" | "waiting";
  children: ReactNode;
  className?: string;
}

export const StepCard = ({ stepNum, title, icon, status, children, className = "" }: StepCardProps) => {
  const statusConfig = {
    complete: { label: "Complete", cls: "bg-success/10 text-success border-success/30" },
    error: { label: "Error", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    waiting: { label: "Waiting", cls: "bg-muted text-muted-foreground border-border" },
  }[status];

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <div>
            <div className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">{stepNum}</div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold ${statusConfig.cls}`}>
          {statusConfig.label}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};
