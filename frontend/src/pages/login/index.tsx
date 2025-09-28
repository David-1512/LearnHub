export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-start sm:items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-[#F5F9F7] shadow-sm">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 text-center">
          <h1 className="mt-3 text-2xl font-semibold text-[#2BB24C]">Iniciar Sesión</h1>
          <p className="mt-1 text-sm text-gray-500">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        {/* Form */}
        <form className="px-6 sm:px-8 pb-8 pt-6 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Contraseña</label>
            <input
              type="password"
              placeholder="************"
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-[#2BB24C] py-3 text-white font-semibold hover:brightness-95 active:translate-y-[1px] transition"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            No tienes cuenta?{" "}
            <a href="/register" className="text-[#2BB24C] font-medium hover:underline">Regístrate aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
}
