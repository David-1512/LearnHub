import { useNavigate} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function NavbarInicio() {
  const nav = useNavigate();
  return (
      <header className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 select-none">
            <LogoIcon className="w-8 h-8 text-[#2BB24C]" />
            <span className="text-xl font-semibold text-[#2BB24C] tracking-tight">TutorMatch</span>
          </a>

        <nav className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => nav("/login")}
            className="px-4 sm:px-5 py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm/0 hover:shadow-sm transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => nav("/register")}
            className="px-4 sm:px-5 py-2.5 rounded-md bg-[#2BB24C] text-white font-medium hover:brightness-95 transition"
          >
            Registrarse
          </button>
        </nav>
      </header>
  );
}



export function NavbarRegistroLogin() {
  const nav = useNavigate();
  return (
      <header className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
           <a href="/" className="flex items-center gap-2 select-none">
            <LogoIcon className="w-8 h-8 text-[#2BB24C]" />
            <span className="text-xl font-semibold text-[#2BB24C] tracking-tight">TutorMatch</span>
          </a>
        <nav className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => nav("/")}
            className="px-4 sm:px-5 py-2.5 rounded-md bg-[#2BB24C] text-white font-medium hover:brightness-95 transition"
          >
            Salir
          </button>
        </nav>
      </header>
  );
}



export function NavbarStudent() {
  const nav = useNavigate();
    const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();            
    nav("/login", { replace: true }); 
  };

  return (
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 select-none">
            <LogoIcon className="w-8 h-8 text-[#2BB24C]" />
            <span className="text-xl font-semibold text-[#2BB24C] tracking-tight">TutorMatch</span>
          </a>
          <nav className="flex items-center gap-2">
            <button 
            onClick={() => nav("/discover")}
            className="inline-flex items-center gap-2 rounded-md bg-[#2BB24C] text-white text-sm font-medium px-3.5 py-2 shadow-sm hover:brightness-95">
              <HeartIcon className="w-4 h-4" />
              Descubrir
            </button>
            <button 
              onClick={() => nav("/discover")}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              Tutores
            </button>
            <button 
              onClick={() => nav("/discover")}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              <UserIcon className="w-4 h-4 text-gray-500" />
              Perfil
            </button>
            <button 
              onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
  );
}

export function NavbarTutor() {
  const nav = useNavigate();
    const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();            
    nav("/login", { replace: true }); 
  };

  return (
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 select-none">
            <LogoIcon className="w-8 h-8 text-[#2BB24C]" />
            <span className="text-xl font-semibold text-[#2BB24C] tracking-tight">TutorMatch</span>
          </a>
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => nav("/students")}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              Estudiantes
            </button>
            <button 
              onClick={() => nav("/students")}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              <UserIcon className="w-4 h-4 text-gray-500" />
              Perfil
            </button>
            <button 
              onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium px-3.5 py-2 hover:shadow-sm">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>
  );
}

function LogoIcon({ className = "" }: { className?: string }) {
  return (
          <svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="w-10 h-10 text-[#2BB24C]"
            fill="currentColor"
          > 
            <path d="M24 6L4 14l20 8 20-8-20-8z" />
            <path d="M12 22v6c0 4.418 5.373 8 12 8s12-3.582 12-8v-6l-12 5-12-5z" />
            <path d="M44 14v10a2 2 0 11-2-2v-6l2-2z" />
          </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21s-7.5-4.35-9.33-8.36C1.48 9.8 3.3 7 6.22 7c1.7 0 3.08.83 3.78 2.02C10.7 7.83 12.08 7 13.78 7c2.93 0 4.74 2.8 3.56 5.64C19.5 16.65 12 21 12 21z" />
    </svg>
  );
}
function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M16 11a4 4 0 100-8 4 4 0 000 8zM6 12a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M2 20v-1c0-2.761 3.582-5 8-5 .69 0 1.36.05 2 .15-2.39 1.02-4 2.78-4 4.85V20H2zm12 0v-1c0-2.21 3.582-4 8-4h0v5h-8z" />
    </svg>
  );
}
function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
    </svg>
  );
}



