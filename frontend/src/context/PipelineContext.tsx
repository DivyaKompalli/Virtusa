import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchDashboardData } from "@/lib/api";

type GlobalMetrics = {
  total_runs: number;
  approvals: number;
  denials: number;
  pending_more_info: number;
  errors: number;
  cumulative_days_saved: number;
};

type RunHistoryRecord = {
  ts: string;
  payer_id: string;
  cpt_codes: string[];
  status: string;
  confidence: number;
};

type PipelineContextType = {
  metrics: GlobalMetrics;
  history: RunHistoryRecord[];
  latestResult: any | null;
  setLatestResult: (result: any) => void;
  refreshDashboardData: () => Promise<void>;
};

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<GlobalMetrics>({
    total_runs: 0, approvals: 0, denials: 0, pending_more_info: 0, errors: 0, cumulative_days_saved: 0
  });
  const [history, setHistory] = useState<RunHistoryRecord[]>([]);
  const [latestResult, setLatestResult] = useState<any>(null);

  const refreshDashboardData = async () => {
    try {
      const data = await fetchDashboardData();
      setMetrics(data.metrics || metrics);
      setHistory(data.history || []);
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  return (
    <PipelineContext.Provider value={{ metrics, history, latestResult, setLatestResult, refreshDashboardData }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
