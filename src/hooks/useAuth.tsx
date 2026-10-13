import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AuraUser,
  friendlyAuthError,
  getCurrentUser,
  loginWithEmail,
  loginWithGoogle as authLoginWithGoogle,
  logout as authLogout,
  registerWithEmail,
  requestPasswordReset,
  subscribeToAuthChanges,
} from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';

interface AuthContextValue {
  user: AuraUser | null;
  loading: boolean;
  cloudMode: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuraUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void getCurrentUser()
      .then((initial) => {
        if (mounted) setUser(initial);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const unsubscribe = subscribeToAuthChanges((next) => {
      if (mounted) setUser(next);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const next = await loginWithEmail(email, password);
      setUser(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : friendlyAuthError(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const next = await authLoginWithGoogle();
      setUser(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : friendlyAuthError(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      setError(null);
      try {
        const next = await registerWithEmail(email, password, displayName);
        setUser(next);
      } catch (err) {
        const message = err instanceof Error ? err.message : friendlyAuthError(err);
        setError(message);
        throw new Error(message);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await requestPasswordReset(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : friendlyAuthError(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      cloudMode: isFirebaseConfigured(),
      error,
      clearError: () => setError(null),
      login,
      loginWithGoogle,
      register,
      logout,
      resetPassword,
    }),
    [user, loading, error, login, loginWithGoogle, register, logout, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
