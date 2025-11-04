import { useParams, useNavigate } from "react-router-dom";
import { useTutors } from "../../features/tutors/api";

export default function TutorPublicProfile() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const { data, isLoading, isError } = useTutors();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-center">Cargando perfil...</div>;
  if (isError) return <div className="p-6 text-center text-red-600">No se pudo cargar el perfil.</div>;

  const tutor = (data ?? []).find((t) => t.id === tutorId);
  if (!tutor) return <div className="p-6 text-center">Tutor no encontrado.</div>;

  return (
    <main className="min-h-screen bg-white">
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
          <button
            className="rounded-lg bg-[#2BB24C] px-4 py-1.5 text-sm font-medium text-white shadow-sm"
            onClick={() => navigate("/student/tutors")}
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <img src={tutor.avatar} alt={tutor.name} className="h-16 w-16 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {tutor.name}
              </h2>
              <p className="text-sm text-gray-600">⭐ {tutor.rating}</p>
            </div>
          </div>

          {/* Bio pill */}
          <div className="mt-5">
            <div className="rounded-lg bg-gray-50 text-[#2BB24C] px-4 py-3 text-sm">
              {tutor.bio}
            </div>
          </div>

          {/* Grid datos */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReadField label="Nombre completo" value={tutor.name} />
            <ReadField label="Correo Electrónico" value={tutor.email ?? "—"} />
            <ReadField label="Edad" value={String(tutor.age)} />
            <ReadField label="Celular" value={tutor.phone ?? "—"} />
            <ReadField label="Ubicación" value={tutor.city} />
            <ReadField label="Horario de atención" value={tutor.schedule} />
          </div>

          {/* Materias */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-2">Materias</label>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 p-3">
              {tutor.subjects.map((s, i) => (
                <span key={`${s}-${i}`} className="inline-flex items-center rounded-full bg-[#2BB24C] px-2.5 py-1 text-xs font-medium text-white">
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
      <input disabled value={value} className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800" />
    </div>
  );
}
