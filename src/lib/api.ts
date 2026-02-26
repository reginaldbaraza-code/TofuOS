/**
 * API client for tofuOS backend.
 * Uses session token from localStorage for authenticated requests.
 * In production (Vercel), set VITE_API_URL to your deployed backend URL.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("tofuos_session");
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session?.token ?? null;
  } catch {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  return headers;
}

export interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "transcript" | "reviews" | "document";
  selected: boolean;
  meta?: { store?: "play" | "apple"; url?: string; fileId?: string };
}

export async function fetchSources(): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/sources`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : "Failed to load sources");
  return res.json();
}

export async function updateSources(sources: Source[]): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/sources`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(sources),
  });
  if (!res.ok) throw new Error("Failed to update sources");
  return res.json();
}

export async function addReviewsSource(
  store: "play" | "apple",
  appPageUrl: string
): Promise<Source> {
  const res = await fetch(`${API_BASE}/sources/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ store, appPageUrl }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to add reviews source");
  }
  return res.json();
}

export async function addDocumentSources(files: File[]): Promise<Source[]> {
  const token = getToken();
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/sources/documents`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Failed to upload documents");
  }
  return res.json();
}

// --- Analyze (AI PM insights) ---
export async function analyzeSources(sourceIds: string[]): Promise<{ insights: string[] }> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ sourceIds }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Analysis failed");
  return data;
}

// --- Jira ---
export interface JiraConfig {
  configured: boolean;
  domain?: string;
  email?: string;
  hasToken?: boolean;
}

export async function getJiraConfig(): Promise<JiraConfig | null> {
  const res = await fetch(`${API_BASE}/jira/config`, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function saveJiraConfig(domain: string, email: string, apiToken: string): Promise<void> {
  const res = await fetch(`${API_BASE}/jira/config`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ domain, email, apiToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Failed to save Jira config");
}

export async function createJiraIssue(params: {
  summary: string;
  description?: string;
  projectKey?: string;
  issueType?: string;
}): Promise<{ key: string; id: string; url: string }> {
  const res = await fetch(`${API_BASE}/jira/create-issue`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "Failed to create Jira issue");
  return data;
}
