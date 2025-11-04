import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useMyTutors, useRemoveLike } from "../../features/tutors/api";

export default function StudentMatches() {
  const { user } = useAuth();
  const studentId = user?.roles.includes("student") ? user.id : undefined;

  const { data, isLoading, isError } = useMyTutors(studentId);
  const removeLike = useRemoveLike(studentId);
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-center">Cargando tutores...</div>;
  if (isError) return <div className="p-6 text-center text-red-600">No se pudieron cargar los tutores.</div>;

  const matches = data ?? [];

  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mis tutores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {matches.map(({ likeId, tutor, createdAt }) => (
            <motion.div
              key={likeId}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Avatar */}
              <div className="flex justify-center bg-gray-50 p-6">
                <img
                  src={tutor.avatar || "https://picsum.photos/seed/fallback/200"}
                  alt={tutor.name}
                  className="h-64 w-full rounded-t-xl object-cover"
                />
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold text-[#16A34A]">
                  {tutor.name}, {tutor.age}
                </h3>

                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <StarIcon className="mr-1 h-4 w-4" /> {tutor.rating}
                </p>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <PinIcon className="mr-1 h-4 w-4" /> {tutor.city}
                </p>

                {/* Chips de materias */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {tutor.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-[#E5E7EB] bg-[#F8FAF9] px-2 py-1 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Botones */}
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 rounded-md bg-[#16A34A] text-white py-2 text-sm hover:bg-[#15803d]"
                    onClick={() => navigate(`/student/tutors/${tutor.id}`)}
                  >
                    Ver Perfil
                  </button>
                  <button
                    className="flex-1 rounded-md bg-red-600 text-white py-2 text-sm hover:bg-red-700 disabled:opacity-60"
                    onClick={() => removeLike.mutate(likeId)}
                    disabled={removeLike.isPending}
                  >
                    Retirar
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Match {ago(createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* Helpers */
function ago(iso?: string) {
  if (!iso) return "reciente";
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86_400_000);
  if (d <= 0) return "hoy";
  if (d === 1) return "hace 1 día";
  if (d < 7) return `hace ${d} días`;
  const w = Math.floor(d / 7);
  return w === 1 ? "hace 1 semana" : `hace ${w} semanas`;
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#F59E0B" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#6B7280" aria-hidden="true">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
  );
}
