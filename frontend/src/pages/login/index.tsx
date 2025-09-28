import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../app/providers/AuthProvider";
import { http } from "../../shared/api/http";

const LoginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginInput = z.infer<typeof LoginSchema>;


export default function LoginPage() {

  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from?.pathname;

   const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

   useEffect(() => {
    if (!user) return;
    const dest = user.roles.includes("tutor") ? "/tutor" : "/student";
    nav(dest, { replace: true });
  }, [user, nav]);

  const onSubmit = async (data: LoginInput) => {
  try {
    const { data: resp } = await http.post("/auth/login", data);
    // resp = { token, user: { id, name, roles } }
    login(resp.user, resp.token);
    const dest = resp.user.roles.includes("tutor") ? "/tutor" : "/student";
    nav(from || dest, { replace: true });
  } catch (e: any) {
    setError("root", { message: e?.response?.data?.message ?? "Error al iniciar sesión" });
  }
};

  return (
    <div className="min-h-screen bg-white flex items-start sm:items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-[#F5F9F7] shadow-sm">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 text-center">
          <h1 className="mt-3 text-2xl font-semibold text-[#2BB24C]">Iniciar Sesión</h1>
          <p className="mt-1 text-sm text-gray-500">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 sm:px-8 pb-8 pt-6 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
             {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#2BB24C]">Contraseña</label>
            <input
              type="password"
              placeholder="************"
                {...register("password")}
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2BB24C]/30 focus:border-[#2BB24C]"
            />
            {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Error general */}
              {"root" in errors && errors.root?.message && (
                <p className="text-sm text-red-600">{errors.root.message}</p>
              )}

          <button
            type="submit"
             disabled={isSubmitting}
            className="mt-2 w-full rounded-md bg-[#2BB24C] py-3 text-white font-semibold hover:brightness-95 active:translate-y-[1px] transition"
          >
           {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
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
