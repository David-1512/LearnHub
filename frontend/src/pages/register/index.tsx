import { useState } from "react";
import { useSearchParams , useNavigate } from "react-router-dom";

type Role = "student" | "tutor";

export default function RegisterPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const presetRole = (params.get("role") as Role) || "student";
  const [role, setRole] = useState<Role>(presetRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { alert("Las contraseñas no coinciden"); 
    return; 
    }
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-white flex items-start sm:items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-[#F5F9F7] shadow-sm">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 text-center">
          <h1 className="mt-3 text-2xl font-semibold text-gray-800">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">Únete a nuestra comunidad de aprendizaje</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 sm:px-8 pb-8 pt-6 space-y-4">
          {/* Tipo de Usuario */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2BB24C]">Tipo de Usuario</label>

            <div className="grid gap-3">
              {/* Estudiante */}
              <label
                className={`flex items-center gap-3 rounded-md border ${
                  role === "student" ? "border-[#2BB24C] bg-white" : "border-gray-200 bg-white"
                } px-3 py-2.5 cursor-pointer transition`}
              >
                <input
                  type="radio"
                  name="role"
                  value="estudiante"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="sr-only"
                />
                <span
                  className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    role === "student" ? "border-[#2BB24C]" : "border-gray-300"
                  }`}
                >
                  <span className={`${role === "student" ? "block" : "hidden"} h-2.5 w-2.5 rounded-full bg-[#2BB24C]`}></span>
                </span>
                <UserIcon className="h-4 w-4 text-[#2BB24C]" />
                <span className="text-sm text-gray-700">Estudiante</span>
              </label>

              {/* Tutor */}
              <label
                className={`flex items-center gap-3 rounded-md border ${
                  role === "tutor" ? "border-[#2BB24C] bg-white" : "border-gray-200 bg-white"
                } px-3 py-2.5 cursor-pointer transition`}
              >
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  checked={role === "tutor"}
                  onChange={() => setRole("tutor")}
                  className="sr-only"
                />
                <span
                  className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    role === "tutor" ? "border-[#2BB24C]" : "border-gray-300"
                  }`}
                >
                  <span className={`${role === "tutor" ? "block" : "hidden"} h-2.5 w-2.5 rounded-full bg-[#2BB24C]`}></span>
                </span>
                <HatIcon className="h-4 w-4 text-[#2BB24C]" />
                <span className="text-sm text-gray-700">Tutor</span>
              </label>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Contraseña</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="************"
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          {/* Confirm */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Confirmar Contraseña</label>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              type="password"
              placeholder="************"
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-[#2BB24C] py-3 text-white font-semibold hover:brightness-95 active:translate-y-[1px] transition"
          >
            Crear Cuenta
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Ya tienes cuenta?{' '}
            <a href="/login" className="text-[#2BB24C] font-medium hover:underline">Inicia sesión aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
    </svg>
  );
}

function HatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M4 10v4c0 2.21 3.582 4 8 4s8-1.79 8-4v-4l-8 4-8-4z" />
    </svg>
  );
}
