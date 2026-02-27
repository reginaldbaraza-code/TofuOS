/**
 * API client for tofuOS - Frontend-only mock implementation.
 * All backend dependencies have been removed.
 */

export interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "transcript" | "reviews" | "document";
  selected: boolean;
  meta?: { store?: "play" | "apple"; url?: string; fileId?: string };
}

const STORAGE_KEY_SOURCES = "tofuos_sources";

const DEFAULT_SOURCES: Source[] = [
  { id: "s1", name: "Customer Interviews Q4.pdf", type: "pdf", selected: true },
  { id: "s2", name: "App Store Reviews", type: "reviews", selected: true },
  { id: "s3", name: "Product Roadmap 2024", type: "document", selected: false },
  { id: "s4", name: "competitor-analysis.link", type: "link", selected: false },
];

function getStoredSources(): Source[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOURCES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(DEFAULT_SOURCES));
      return DEFAULT_SOURCES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SOURCES;
  }
}

function saveStoredSources(sources: Source[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(sources));
  } catch (e) {
    console.error("Failed to save sources to localStorage", e);
  }
}

export async function fetchSources(): Promise<Source[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getStoredSources();
}

export async function updateSources(sources: Source[]): Promise<Source[]> {
  saveStoredSources(sources);
  return sources;
}

export async function addReviewsSource(
  store: "play" | "apple",
  appPageUrl: string
): Promise<Source> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const newSource: Source = {
    id: `s-${Date.now()}`,
    name: `${store === "play" ? "Play Store" : "App Store"} Reviews`,
    type: "reviews",
    selected: true,
    meta: { store, url: appPageUrl }
  };
  
  const sources = getStoredSources();
  const next = [...sources, newSource];
  saveStoredSources(next);
  
  return newSource;
}

export async function addDocumentSources(files: File[]): Promise<Source[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const newSources: Source[] = files.map((file, i) => ({
    id: `f-${Date.now()}-${i}`,
    name: file.name,
    type: file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "document",
    selected: true,
  }));
  
  const sources = getStoredSources();
  const next = [...sources, ...newSources];
  saveStoredSources(next);
  
  return newSources;
}

// --- Analyze (AI PM insights) ---
export async function analyzeSources(sourceIds: string[]): Promise<{ insights: string[] }> {
  // Mock insights
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (sourceIds.length === 0) {
    return { insights: [] };
  }

  return {
    insights: [
      "Users frequently complain about the slow loading times in the mobile app.",
      "70% of feedback mentions the new UI is confusing to navigate.",
      "Several high-value customers are requesting a dark mode feature.",
      "The integration with Slack is highly praised by power users."
    ]
  };
}

// --- Jira ---
export interface JiraConfig {
  configured: boolean;
  domain?: string;
  email?: string;
  hasToken?: boolean;
}

const STORAGE_KEY_JIRA = "tofuos_jira_config";

export async function getJiraConfig(): Promise<JiraConfig | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JIRA);
    if (!raw) return { configured: false };
    const config = JSON.parse(raw);
    return { ...config, configured: true, hasToken: !!config.apiToken };
  } catch {
    return { configured: false };
  }
}

export async function saveJiraConfig(domain: string, email: string, apiToken: string): Promise<void> {
  const config = { domain, email, apiToken };
  localStorage.setItem(STORAGE_KEY_JIRA, JSON.stringify(config));
}

export async function createJiraIssue(params: {
  summary: string;
  description?: string;
  projectKey?: string;
  issueType?: string;
}): Promise<{ key: string; id: string; url: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Return a mock Jira issue
  const id = Math.floor(Math.random() * 10000);
  return {
    key: `TOFU-${id}`,
    id: id.toString(),
    url: `https://mock-jira.atlassian.net/browse/TOFU-${id}`
  };
}
