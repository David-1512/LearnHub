import {
  createContext, useContext, useMemo, useState, ReactNode, useEffect,
} from "react";

export type Role = "student" | "tutor" | "admin";
export type User = { id: string; name: string; roles: Role[] } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  login: (u: NonNullable<User>, token: string) => void;
  logout: (opts?: { server?: boolean }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// claves de storage (evita colisiones)
const K_USER = "tm_user";
const K_TOKEN = "tm_token";
const K_LOGOUT_BCAST = "tm_logout";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  // Rehidratación
  useEffect(() => {
    try {
      const u = localStorage.getItem(K_USER);
      const t = localStorage.getItem(K_TOKEN);
      if (u) setUser(JSON.parse(u));
      if (t) setToken(t);
    } catch { /* ignore */ }
  }, []);

  // logout multi-pestaña
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === K_LOGOUT_BCAST) {
        setUser(null);
        setToken(null);
        localStorage.removeItem(K_USER);
        localStorage.removeItem(K_TOKEN);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const broadcastLogout = () => {
    localStorage.setItem(K_LOGOUT_BCAST, String(Date.now()));
  };

  const serverLogout = async () => {
    try {
      // si manejas cookies httpOnly en el backend:
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        keepalive: true,
      });
    } catch { /* ignore */ }
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    login: (u, t) => {
      setUser(u);
      setToken(t);
      localStorage.setItem(K_USER, JSON.stringify(u));
      localStorage.setItem(K_TOKEN, t);
    },
    logout: async ({ server = true } = {}) => {
      if (server) await serverLogout();
      setUser(null);
      setToken(null);
      localStorage.removeItem(K_USER);
      localStorage.removeItem(K_TOKEN);
      broadcastLogout();
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fuera de AuthProvider");
  return ctx;
}