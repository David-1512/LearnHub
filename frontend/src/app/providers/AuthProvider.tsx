import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";

export type Role = "student" | "tutor" | "admin";
export type User = { id: string; name: string; roles: Role[] } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (u: NonNullable<User>, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      if (u) setUser(JSON.parse(u));
      if (t) setToken(t);
    } catch { /* ignore */ }
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    login: (u, t) => {
      setUser(u);
      setToken(t);
      localStorage.setItem("user", JSON.stringify(u));
      localStorage.setItem("token", t);
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}