const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://127.0.0.1:8000";

type RunPipelinePayload = {
  input_mode: "EHR Note" | "CSV Patient";
  ehr_note?: string;
  csv_patient?: number;
  payer: string;
  force_denial?: boolean;
};

export const runPipeline = async (payload: RunPipelinePayload) => {
  const response = await fetch(`${API_BASE_URL}/api/run_pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Pipeline request failed (${response.status})`);
  }

  return response.json();
};

export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard_data`);
  if (!response.ok) {
    throw new Error(`Dashboard request failed (${response.status})`);
  }

  return response.json();
};

export const fetchAppealsData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/appeals_data`);
  if (!response.ok) {
    throw new Error(`Appeals request failed (${response.status})`);
  }

  return response.json();
};

export const fetchPolicyLibraryData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/policy_library_data`);
  if (!response.ok) {
    throw new Error(`Policy library request failed (${response.status})`);
  }

  return response.json();
};
