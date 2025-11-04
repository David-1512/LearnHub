import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  useMyStudentsForTutor,
  useRemoveStudentMatch,
  type MyStudent,
} from "../../features/students/api";

export default function TutorDash() {
  const { user } = useAuth();
  const tutorId = user?.id ?? "t1"; // fallback dev
  const { data, isLoading, isError } = useMyStudentsForTutor(tutorId);
  const removeMatch = useRemoveStudentMatch(tutorId);
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6 text-center">Cargando estudiantes...</div>;
  if (isError)   return <div className="p-6 text-center text-red-600">No se pudieron cargar los estudiantes.</div>;

  const matches = (data ?? []) as MyStudent[];

  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mis estudiantes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {matches.map((m) => (
            <motion.div
              key={m.likeId}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Imagen */}
              <div className="flex justify-center bg-gray-50 p-6">
                <img
                  src={m.student.avatar || "https://picsum.photos/seed/fallback/200"}
                  alt={m.student.name}
                  className="h-64 w-full rounded-t-xl object-cover"
                />
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold text-[#16A34A]">
                  {m.student.name}, {m.student.age}
                </h3>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <PinIcon className="mr-1 h-4 w-4" />
                  {m.student.city}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Match {formatAgo(m.createdAt)}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 rounded-md bg-[#16A34A] text-white py-2 text-sm hover:bg-[#15803d]"
                    onClick={() => navigate(`/tutor/students/${m.student.id}`)}
                  >
                    Ver Perfil
                  </button>
                  <button
                    className="flex-1 rounded-md bg-red-600 text-white py-2 text-sm hover:bg-red-700 disabled:opacity-60"
                    onClick={() => removeMatch.mutate(m.likeId)}
                    disabled={removeMatch.isPending}
                  >
                    {removeMatch.isPending ? "Retirando..." : "Retirar"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {matches.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed p-8 text-center text-gray-600">
          Aún no tienes estudiantes con match.
        </div>
      )}
    </main>
  );
}

/* ---------- util & icono ---------- */
function formatAgo(iso?: string) {
  if (!iso) return "recientemente";
  const d = new Date(iso);
  if (isNaN(+d)) return "recientemente";
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  const m = Math.floor(sec / 60);
  const h = Math.floor(sec / 3600);
  const day = Math.floor(sec / 86400);
  const wk = Math.floor(sec / 604800);
  if (wk > 0) return `hace ${wk} semana${wk > 1 ? "s" : ""}`;
  if (day > 0) return `hace ${day} día${day > 1 ? "s" : ""}`;
  if (h > 0) return `hace ${h} hora${h > 1 ? "s" : ""}`;
  if (m > 0) return `hace ${m} min`;
  return "ahora";
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#6B7280" aria-hidden="true">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  );
}
