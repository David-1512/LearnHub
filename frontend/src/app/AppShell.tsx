import { Outlet, Link, useLocation } from "react-router-dom";

export default function AppShell() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/login" className="text-sm font-semibold">LearnHub</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link className={linkCx(pathname==="/student")} to="/student">Estudiante</Link>
            <Link className={linkCx(pathname==="/tutor")} to="/tutor">Tutor</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function linkCx(active: boolean) {
  return [
    "rounded-lg border px-3 py-1.5 hover:bg-gray-50",
    active ? "bg-gray-100" : ""
  ].join(" ");
}