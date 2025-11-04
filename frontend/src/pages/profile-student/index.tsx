import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  useStudent,
  useUpdateStudent,
  useUpdateStudentInterests,
  type Student,
} from "../../features/students/api";

type Form = {
  name: string;
  email: string;
  age: string;
  phone: string;
  city: string;
  interests: string[];
  bio: string;
  password: string;
  avatar: string;
  title: string;
};

type Errors = Partial<Record<keyof Form | "newInterest", string>>;
const TEN_MIN = 10 * 60 * 1000;

export default function StudentProfile() {
  const { user } = useAuth();
  const studentId = user?.id ?? "s1"; // usa el id real del estudiante logueado
  const { data, isLoading, isError } = useStudent(studentId);
  const updateMutation = useUpdateStudent();
  const updateInterests = useUpdateStudentInterests(studentId);

  const initial: Form = useMemo(() => {
    const s = (data ?? {}) as Partial<Student>;
    return {
      name: s.name ?? "David Serrano",
      email: s.email ?? "david.serrano.medrano@est.una.ac.cr",
      age: s.age != null ? String(s.age) : "22",
      phone: s.phone ?? "+506 88876531",
      city: s.city ?? "San José, Pavas",
      interests: s.interests ?? ["Matemáticas", "Base de datos", "Programación"],
      bio:
        s.bio ??
        "Estudiante de ingeniería en sistemas buscando apoyo en materias de la carrera",
      password: "",
      avatar:
        s.avatar ??
        "https://images.unsplash.com/illustration-dummy?q=80&w=400&auto=format",
      title: s.title ?? "Ingeniería en sistemas",
    };
  }, [data]);

  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [newInterest, setNewInterest] = useState("");
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [interestsState, setInterestsState] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => setForm(initial), [initial]);

  // Validaciones
  function validateField<K extends keyof Form>(k: K, v: Form[K]) {
    const val = String(v ?? "").trim();
    switch (k) {
      case "name":
        if (!val) return "Requerido";
        if (val.length < 2) return "Mínimo 2 caracteres";
        break;
      case "email":
        if (!val) return "Requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Correo inválido";
        break;
      case "age":
        if (!val) return "Requerido";
        if (!/^\d+$/.test(val)) return "Debe ser numérico";
        break;
      case "phone":
        if (!val) return "Requerido";
        if (!/^[\d\s+\-()]{7,20}$/.test(val)) return "Teléfono inválido";
        break;
      case "password":
        if (!val) return undefined;
        if (val.length < 8) return "Mínimo 8 caracteres";
        break;
      case "city":
      case "bio":
        if (!val) return "Requerido";
        break;
      default:
        break;
    }
    return undefined;
  }

  function setField<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    const msg = validateField(k, v);
    setErrors((e) => ({ ...e, [k]: msg }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleAutoSave, TEN_MIN);
  }

  function addInterest() {
    const val = newInterest.trim();
    if (!val) {
      setErrors((e) => ({ ...e, newInterest: "Escribe una materia" }));
      return;
    }
    if (form.interests.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setErrors((e) => ({ ...e, newInterest: "La materia ya existe" }));
      return;
    }
    setErrors((e) => ({ ...e, newInterest: undefined }));
    const next = [...form.interests, val];
    setForm((f) => ({ ...f, interests: next }));
    setNewInterest("");

    // persistir de inmediato
    setInterestsState("saving");
    updateInterests
      .mutateAsync(next)
      .then(() => {
        setInterestsState("saved");
        setTimeout(() => setInterestsState("idle"), 1500);
      })
      .catch(() => {
        setInterestsState("error");
        setTimeout(() => setInterestsState("idle"), 2500);
      });

    setDirty(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleAutoSave, TEN_MIN);
  }

  function buildPayload() {
    return {
      name: form.name.trim(),
      email: form.email.trim(),
      age: Number(form.age),
      phone: form.phone.trim(),
      city: form.city.trim(),
      interests: form.interests,
      bio: form.bio.trim(),
      avatar: form.avatar,
      title: form.title,
      password: form.password ? form.password : undefined,
    };
  }

  async function handleAutoSave() {
    const newErr: Errors = {};
    (Object.keys(form) as (keyof Form)[]).forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) newErr[k] = msg;
    });
    setErrors(newErr);
    if (Object.values(newErr).some(Boolean)) return;

    setSaveState("saving");
    try {
      await updateMutation.mutateAsync({
        studentId,
        payload: buildPayload(),
      });
      setDirty(false);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (dirty) void handleAutoSave();
    };
  }, [dirty]);

  if (isLoading) return <div className="p-6 text-center">Cargando perfil...</div>;
  if (isError) return <div className="p-6 text-center text-red-600">No se pudo cargar el perfil.</div>;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">
              {saveState === "saving"
                ? "Guardando…"
                : saveState === "saved"
                ? "Guardado ✓"
                : dirty
                ? "Cambios pendientes"
                : ""}
            </span>
            {interestsState !== "idle" && (
              <span
                className={
                  interestsState === "error"
                    ? "text-red-600"
                    : interestsState === "saved"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {interestsState === "saving"
                  ? "Guardando materias…"
                  : interestsState === "saved"
                  ? "Materias guardadas ✓"
                  : "Error al guardar materias"}
              </span>
            )}
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          {/* Encabezado */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={form.avatar}
                alt={form.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#2BB24C] text-white ring-4 ring-white flex items-center justify-center"
                aria-label="Cambiar foto"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 5l1.5 2H16a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h2.5L12 5zm0 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#2BB24C] leading-tight">
                {form.name}
              </h2>
              <p className="text-sm text-gray-600">{form.title}</p>
            </div>
          </div>

          {/* Grid 2×N */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Nombre completo"
              type="text"
              value={form.name}
              onChange={(v) => setField("name", v)}
              error={errors.name}
            />
            <Field
              label="Correo Electrónico"
              type="email"
              value={form.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
              placeholder="correo@dominio.com"
            />
            <Field
              label="Edad"
              type="number"
              value={form.age}
              onChange={(v) => setField("age", v)}
              error={errors.age}
            />
            <Field
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(v) => setField("password", v)}
              error={errors.password}
              placeholder="••••••••"
            />
            <Field
              label="Ubicación"
              type="text"
              value={form.city}
              onChange={(v) => setField("city", v)}
              error={errors.city}
            />
            <Field
              label="Celular"
              type="tel"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              error={errors.phone}
              placeholder="+506 88876531"
            />
          </div>

          {/* Materias de Interés */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">Materias de Interés</label>
            <div className="flex flex-wrap items-center gap-2">
              {form.interests.map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="inline-flex items-center rounded-full bg-[#2BB24C] px-2.5 py-1 text-xs font-medium text-white"
                >
                  {s}
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  value={newInterest}
                  onChange={(e) => {
                    setNewInterest(e.target.value);
                    if (errors.newInterest)
                      setErrors((er) => ({ ...er, newInterest: undefined }));
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                  placeholder="Nueva materia"
                  className={`h-9 w-56 rounded-md border px-3 text-sm text-gray-800 placeholder-gray-400 ${
                    errors.newInterest ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                  }`}
                />
                <button
                  type="button"
                  className="h-9 w-9 rounded-md bg-[#2BB24C] text-white flex items-center justify-center"
                  aria-label="Agregar materia"
                  onClick={addInterest}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                  </svg>
                </button>
              </div>
            </div>
            {errors.newInterest && (
              <p className="mt-1 text-xs text-red-600">{errors.newInterest}</p>
            )}
          </div>

          {/* Sobre mi */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-1">Sobre mi</label>
            <textarea
              value={form.bio}
              onChange={(e) => setField("bio", e.target.value)}
              className={`w-full min-h-[88px] rounded-md border px-3 py-2 text-sm text-gray-800 ${
                errors.bio ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
              }`}
            />
            {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  inputProps,
}: {
  label: string;
  type: "text" | "email" | "number" | "tel" | "password";
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-800 ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
