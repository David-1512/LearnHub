import { useNavigate} from "react-router-dom";

export function NavbarInicio() {
  const nav = useNavigate();
  return (
      <header className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 select-none">
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
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2BB24C]">
            TutorMatch
          </span>
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



export function NavbarRegistro() {
  const nav = useNavigate();
  return (
      <header className="max-w-7xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 select-none">
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
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2BB24C]">
            TutorMatch
          </span>
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