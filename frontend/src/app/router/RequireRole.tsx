import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

type Props = { allow: Array<"student" | "tutor" | "admin">; children: ReactNode };

export default function RequireRole({ allow, children }: Props) {
  const { user } = useAuth();
  const loc = useLocation();

  // No autenticado → a /login (y recuerda adónde iba)
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  // Sin rol permitido → home (o 403 si prefieres)
  const ok = user.roles?.some(r => allow.includes(r));
  if (!ok) return <Navigate to="/" replace />;

  return <>{children}</>;
}