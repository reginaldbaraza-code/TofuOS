/**
 * Authentication module: types, storage keys, and session API.
 * Replace the mock login implementation with your backend when ready.
 */

export const AUTH_STORAGE_KEY = "tofuos_session";

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginResult =
  | { success: true; session: Session }
  | { success: false; error: string };

/**
 * Persists session to localStorage. Call after successful login.
 */
export function persistSession(session: Session): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Loads session from localStorage. Returns null if missing or expired.
 */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session?.user?.id || !session?.token || typeof session.expiresAt !== "number") {
      return null;
    }
    if (Date.now() >= session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Removes session from localStorage. Call on logout.
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

/**
 * Login via backend. On success, session is persisted to localStorage.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.error ?? "Login failed" };
    }
    const session: Session = {
      user: data.user,
      token: data.token,
      expiresAt: data.expiresAt,
    };
    persistSession(session);
    return { success: true, session };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Network error. Is the server running?",
    };
  }
}

/**
 * Logout: invalidate token on server and clear local session.
 */
export async function logoutRequest(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // ignore
  }
}
