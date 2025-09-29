import { useEffect } from "react";

export function useLogoutOnClose() {
  useEffect(() => {
    const onBeforeUnload = () => {
      try {
        // Notifica al backend sin bloquear el cierre
        if (navigator.sendBeacon) {
          const data = new Blob([], { type: "application/json" });
          navigator.sendBeacon("/api/auth/logout", data);
        } else {
          // Fallback: fetch con keepalive
          fetch("/api/auth/logout", { method: "POST", credentials: "include", keepalive: true });
        }
      } catch {}
      // Limpia almacenamiento y sincroniza otras pestañas
      localStorage.removeItem("tm_token");
      localStorage.setItem("tm_logout", String(Date.now()));
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);
}