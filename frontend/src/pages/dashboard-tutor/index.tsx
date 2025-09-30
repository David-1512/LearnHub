import { useStudents } from "../../features/students/api";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorDash() {
  const { data, isLoading, isError } = useStudents();

  if (isLoading) {
    return <div className="p-6 text-center">Cargando estudiantes...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        No se pudieron cargar los estudiantes.
      </div>
    );
  }

  const students = data ?? [];

  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mis estudiantes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {students.map((s) => (
            <motion.div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Avatar */}
              <div className="flex justify-center bg-gray-50 p-6">
                <img
                  src={s.avatar || "https://picsum.photos/seed/fallback/200"}
                  alt={s.name}
                  className="h-64 w-full rounded-t-xl object-cover"
                />
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold text-[#16A34A]">
                  {s.name}, {s.age}
                </h3>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  <PinIcon className="mr-1 h-4 w-4" />
                  {s.city}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Match hace {s.matchDuration}
                </p>

                {/* Botones */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-md bg-[#16A34A] text-white py-2 text-sm hover:bg-[#15803d]">
                    Ver Perfil
                  </button>
                  <button className="flex-1 rounded-md bg-red-600 text-white py-2 text-sm hover:bg-red-700">
                    Retirar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ---------- Iconos ---------- */
function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="#6B7280"
      aria-hidden="true"
    >
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 
      0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 
      2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  );
}