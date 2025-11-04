import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../../features/students/api";

export default function StudentPublicProfile() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data, isLoading, isError } = useStudent(studentId!);
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-center">Cargando perfil...</div>;
  if (isError || !data) return <div className="p-6 text-center text-red-600">No se pudo cargar el perfil.</div>;

  // Fallbacks para que el diseño siempre calce con la maqueta
  const name = data.name ?? "David Serrano";
  const title = data.title ?? "Ingeniería en sistemas";
  const avatar = data.avatar ?? "https://picsum.photos/seed/student/640/360";
  const bio =
    data.bio ??
    "Estudiante de ingeniería en sistemas buscando apoyo en materias de la carrera";
  const email = data.email ?? "david.serrano.medrano@est.una.ac.cr";
  const phone = data.phone ?? "+506 88876531";
  const age = data.age ?? 22;
  const city = data.city ?? "San José, Pavas";
  const interests = data.interests ?? ["Matemáticas", "Base de datos", "Programación"];

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar (igual estilo que las otras pantallas) */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-sm bg-[#2BB24C] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
                <path d="M2 10l10-5 10 5-10 5-10-5zm2 4l8 4 8-4v3l-8 4-8-4v-3z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-[#2BB24C]">TutorMatch</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-lg bg-[#2BB24C] px-4 py-1.5 text-sm font-medium text-white shadow-sm"
              onClick={() => navigate("/tutor/students")}
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-600">{title}</p>
            </div>
          </div>

          {/* Bio pill */}
          <div className="mt-5">
            <div className="rounded-lg bg-gray-50 text-[#2BB24C] px-4 py-3 text-sm">
              {bio}
            </div>
          </div>

          {/* Grid de datos (solo lectura) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadField label="Nombre completo" value={name} />
            <ReadField label="Correo Electrónico" value={email} />
            <ReadField label="Edad" value={String(age)} />
            <ReadField label="Celular" value={phone} />
            <ReadField label="Ubicación" value={city} />
          </div>

          {/* Materias de Interés */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">Materias de Interés</label>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 p-3">
              {interests.map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="inline-flex items-center rounded-full bg-[#2BB24C] px-2.5 py-1 text-xs font-medium text-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        disabled
        value={value}
        className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
      />
    </div>
  );
}
