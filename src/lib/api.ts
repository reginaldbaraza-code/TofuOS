/**
 * API client for tofuOS - Supabase and OpenAI implementation.
 */
import { supabase } from './supabase/client';

export interface Source {
  id: string;
  name: string;
  type: "pdf" | "link" | "transcript" | "reviews" | "document";
  selected: boolean;
  meta?: { store?: "play" | "apple"; url?: string; fileId?: string };
  user_id?: string;
}

export async function fetchSources(): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sources:', error);
    return [];
  }
  return data as Source[];
}

export async function updateSources(sources: Source[]): Promise<Source[]> {
  // In a real DB, we might want to update individually, but for a mock-to-real migration,
  // we'll handle the 'selected' status updates.
  for (const source of sources) {
    await supabase
      .from('sources')
      .update({ selected: source.selected })
      .eq('id', source.id);
  }
  return sources;
}

export async function addReviewsSource(
  store: "play" | "apple",
  appPageUrl: string
): Promise<Source> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const newSource = {
    name: `${store === "play" ? "Play Store" : "App Store"} Reviews`,
    type: "reviews",
    selected: true,
    meta: { store, url: appPageUrl },
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('sources')
    .insert(newSource)
    .select()
    .single();

  if (error) throw error;
  return data as Source;
}

export async function addDocumentSources(files: File[]): Promise<Source[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const newSources = files.map((file) => ({
    name: file.name,
    type: file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "document",
    selected: true,
    user_id: user.id
  }));

  const { data, error } = await supabase
    .from('sources')
    .insert(newSources)
    .select();

  if (error) throw error;
  return data as Source[];
}

// --- Analyze (AI PM insights) ---
export async function analyzeSources(sourceIds: string[]): Promise<{ insights: string[] }> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }

  return response.json();
}

// --- Conversational Chat with AI ---
export async function chatWithAI(
  message: string, 
  sourceIds: string[], 
  history: { role: "user" | "assistant"; content: string }[]
): Promise<{ content: string }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sourceIds, history }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Chat failed');
  }

  return response.json();
}

// --- Jira ---
export interface JiraConfig {
  configured: boolean;
  domain?: string;
  email?: string;
  hasToken?: boolean;
  lastProjectKey?: string;
}

export async function getJiraConfig(): Promise<JiraConfig | null> {
  const { data, error } = await supabase
    .from('jira_configs')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
    console.error('Error fetching Jira config:', error);
    return { configured: false };
  }

  if (!data) return { configured: false };

  return { 
    ...data, 
    configured: true, 
    hasToken: !!data.api_token,
    lastProjectKey: data.last_project_key
  };
}

export async function saveJiraConfig(domain: string, email: string, apiToken: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('jira_configs')
    .upsert({ 
      domain, 
      email, 
      api_token: apiToken,
      user_id: user.id 
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
}

export async function createJiraIssue(params: {
  summary: string;
  description?: string;
  projectKey?: string;
  issueType?: string;
}): Promise<{ key: string; id: string; url: string }> {
  // Pass the access token to the server route
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/jira/create-issue', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create Jira issue');
  }

  return response.json();
}
