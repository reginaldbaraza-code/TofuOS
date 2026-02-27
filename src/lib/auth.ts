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
 * Login: simulates successful login with mock user.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Accept any login for now
  const session: Session = {
    user: {
      id: "mock-user-id",
      email: credentials.email,
      displayName: credentials.email.split("@")[0] || credentials.email || "User",
    },
    token: "mock-jwt-token",
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  persistSession(session);
  return { success: true, session };
}

/**
 * Logout: clear local session.
 */
export function logoutRequest(token: string): void {
  clearSession();
}
