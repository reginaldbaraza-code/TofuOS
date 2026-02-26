import * as React from "react";
import {
  loadSession,
  clearSession,
  login as authLogin,
  logoutRequest,
  type Session,
  type LoginCredentials,
} from "@/lib/auth";

interface AuthState {
  session: Session | null;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
  user: Session["user"] | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    session: null,
    isInitialized: false,
  });

  // Initialize session from storage on mount
  React.useEffect(() => {
    const session = loadSession();
    setState({ session, isInitialized: true });
  }, []);

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    const result = await authLogin(credentials);
    if (result.success) {
      setState((prev) => ({ ...prev, session: result.session }));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = React.useCallback(() => {
    const token = state.session?.token;
    if (token) logoutRequest(token);
    clearSession();
    setState((prev) => ({ ...prev, session: null }));
  }, [state.session?.token]);

  const value: AuthContextValue = React.useMemo(
    () => ({
      ...state,
      user: state.session?.user ?? null,
      login,
      logout,
      isAuthenticated: !!state.session,
    }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
