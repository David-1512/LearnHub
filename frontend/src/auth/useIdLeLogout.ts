import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export function useIdleLogout(timeoutMs = 15 * 60 * 1000) { 
  const { logout } = useAuth();

  useEffect(() => {
    let t: number;

    const reset = () => {
      window.clearTimeout(t);
      t = window.setTimeout(async () => {
        await logout();
        window.location.assign("/login");
      }, timeoutMs);
    };

    const events = ["mousemove","mousedown","keydown","scroll","touchstart","focus"];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      window.clearTimeout(t);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [logout, timeoutMs]);
}