import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTutor, useUpdateTutor, useUpdateSubjects  } from "../../features/tutors/api";

type Form = {
  name: string;
  email: string;
  age: string;        // lo manejamos como string para inputs controlados
  phone: string;
  city: string;
  schedule: string;
  subjects: string[];
  bio: string;
  password: string;   // opcional
  avatar: string;
  title: string;      // solo visual
};

type Errors = Partial<Record<keyof Form | "newSubject", string>>;

const TEN_MIN = 10 * 60 * 1000;

export default function TutorProfile() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const { data, isLoading, isError } = useTutor(tutorId!);
  const updateMutation = useUpdateTutor();
  const updateSubjects = useUpdateSubjects(tutorId!);

  const initial: Form = useMemo(() => {
    const t = (data ?? {}) as Partial<Tutor> & {
      title?: string;
      email?: string;
      phone?: string;
    };

    return {
      name: t.name ?? "María González",
      email: t.email ?? "maria.gonzalez@est.una.ac.cr",
      age: t.age != null ? String(t.age) : "26",
      phone: t.phone ?? "6022-2231",
      city: t.city ?? "San José, Pavas",
      schedule: t.schedule ?? "Lun - Vie · 2 - 8pm",
      subjects: t.subjects ?? ["Matemáticas", "Física"],
      bio: t.bio ?? "Estudiante de cuarto semestre de la enseñanza de la matemática",
      password: "",
      avatar:
        t.avatar ??
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop",
      title: t["title"] ?? "Enseñanza de la matemática",
    };
  }, [data]);

  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [newSubject, setNewSubject] = useState("");
  const [dirty, setDirty] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [subjectsSaveState, setSubjectsSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => setForm(initial), [initial]);

  // Validaciones por campo
  function validateField<K extends keyof Form>(k: K, v: Form[K]): string | undefined {
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
       // const n = Number(val);
        //if (n < 14 || n > 100) return "Edad fuera de rango";
        break;
      case "phone":
        if (!val) return "Requerido";
        if (!/^[\d\s+\-()]{7,20}$/.test(val)) return "Teléfono inválido";
        break;
      case "password":
        if (!val) return undefined; // opcional
        if (val.length < 8) return "Mínimo 8 caracteres";
        break;
      case "city":
      case "schedule":
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

    // validar solo el campo cambiado
    const msg = validateField(k, v);
    setErrors((e) => ({ ...e, [k]: msg }));

    // reinicia temporizador de auto-guardado
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleAutoSave, TEN_MIN);
  }

  function addSubject() {
    const val = newSubject.trim();
    if (!val) {
      setErrors((e) => ({ ...e, newSubject: "Escribe una materia" }));
      return;
    }
     if (form.subjects.some((s) => s.toLowerCase() === val.toLowerCase())) {
      setErrors((e) => ({ ...e, newSubject: "La materia ya existe" }));
      return;
    }
    setErrors((e) => ({ ...e, newSubject: undefined }));
    const nextSubjects = [...form.subjects, val];
    setForm((f) => ({ ...f, subjects: nextSubjects }));
    setNewSubject("");
    setSubjectsSaveState("saving");
    updateSubjects
      .mutateAsync(nextSubjects)
      .then(() => {
    setSubjectsSaveState("saved");
      setTimeout(() => setSubjectsSaveState("idle"), 1500);
    })
    .catch(() => {
        // rollback ya lo hace onError del hook; solo avisamos
    setSubjectsSaveState("error");
      setTimeout(() => setSubjectsSaveState("idle"), 2500);
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
      schedule: form.schedule.trim(),
      subjects: form.subjects,
      bio: form.bio.trim(),
      avatar: form.avatar,
      password: form.password ? form.password : undefined,
    };
  }

  async function handleAutoSave() {
    // valida todo antes de enviar
    const newErr: Errors = {};
    (Object.keys(form) as (keyof Form)[]).forEach((k) => {
      const msg = validateField(k, form[k]);
      if (msg) newErr[k] = msg;
    });
    setErrors(newErr);
    if (Object.values(newErr).some(Boolean)) return; // no guardar si hay errores

    setSaveState("saving");
    try {
      await updateMutation.mutateAsync({
        tutorId: tutorId!,
        payload: buildPayload(),
      });
      setDirty(false);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("idle");
    }
  }

  // en desmontaje: guarda si quedó sucio
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
          <div className="flex items-center gap-3">
            {/* estado global del autosave */}
            <span className="text-xs text-gray-500">
              {saveState === "saving"
                ? "Guardando…"
                : saveState === "saved"
                ? "Guardado ✓"
                : dirty
                ? "Cambios pendientes"
                : ""}
            </span>
            {/* estado de materias */}
            {subjectsSaveState !== "idle" && (
              <span
                className={`text-xs ${
                  subjectsSaveState === "error"
                    ? "text-red-600"
                    : subjectsSaveState === "saving"
                    ? "text-gray-500"
                    : "text-green-600"
                }`}
              >
                {subjectsSaveState === "saving"
                  ? "Guardando materias…"
                  : subjectsSaveState === "saved"
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
              <img src={form.avatar} alt={form.name} className="h-16 w-16 rounded-full object-cover" />
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
              <h2 className="text-lg font-semibold text-[#2BB24C] leading-tight">{form.name}</h2>
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
              inputProps={{ min: 14, max: 100 }}
            />

            <Field
              label="Celular"
              type="tel"
              value={form.phone}
              onChange={(v) => setField("phone", v)}
              error={errors.phone}
              placeholder="+506 6000 0000"
            />

            <Field
              label="Ubicación"
              type="text"
              value={form.city}
              onChange={(v) => setField("city", v)}
              error={errors.city}
            />

            <Field
              label="Horario de atención"
              type="text"
              value={form.schedule}
              onChange={(v) => setField("schedule", v)}
              error={errors.schedule}
            />

            {/* Contraseña (solo si desea cambiarla) */}
            <Field
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(v) => setField("password", v)}
              error={errors.password}
              placeholder="••••••••"
            />
          </div>

         {/* Mis materias */}
        <div className="mt-6">
          <label className="block text-sm text-gray-600 mb-2">Mis materias</label>
          <div className="flex flex-wrap items-center gap-2">
            {form.subjects.map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-[#2BB24C] border border-[#2BB24C]/30"
              >
                {s}
              </span>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={newSubject}
                onChange={(e) => {
                  setNewSubject(e.target.value);
                  if (errors.newSubject) setErrors((er) => ({ ...er, newSubject: undefined }));
                }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                placeholder="Nueva materia"
                className={`h-9 w-56 rounded-md border px-3 text-sm text-gray-800 placeholder-gray-400 ${
                  errors.newSubject ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                }`}
              />
              <button
                type="button"
                className="h-9 w-9 rounded-md bg-[#2BB24C] text-white flex items-center justify-center"
                aria-label="Agregar materia"
                onClick={addSubject}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
                </svg>
              </button>
            </div>
          </div>
          {errors.newSubject && <p className="mt-1 text-xs text-red-600">{errors.newSubject}</p>}
        </div>

          {/* Sobre mí */}
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

/** Input reutilizable con estilos del mockup + validación */
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
