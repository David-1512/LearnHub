import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion"; 
import { useTutors, useLikeTutor } from "../../features/tutors/api";
import type { Tutor } from "../../features/tutors/api";

export default function StudentDash() {
  const { data, isLoading, isError } = useTutors();
  const likeMut = useLikeTutor();
  const [idx, setIdx] = useState(0);

  const tutors = data ?? [];
  const hasMore = idx < tutors.length;
  const tutor = useMemo(() => (hasMore ? tutors[idx] : undefined), [tutors, idx, hasMore]);

  const next = () => setIdx((i) => (i + 1 < tutors.length ? i + 1 : i));
  const like = (t: Tutor) => {
    likeMut.mutate({ tutorId: t.id });
    next();
  };
  const skip = () => next();

  function onDragEnd(_: any, info: PanInfo) {
    if (!tutor) return;
    const { offset, velocity } = info;
    const power = Math.abs(offset.x) * velocity.x;
    const threshold = 800; // sensibilidad
    if (power > threshold) like(tutor); // derecha = like
    else if (power < -threshold) skip(); // izquierda = skip
  }

  if (isError) {
    return <div className="p-6 text-center text-red-600">No se pudieron cargar los tutores.</div>;
  }

  return (
    <main className="px-4 py-6">
      <h1 className="text-center text-2xl font-semibold text-gray-800">Descubre Tutores</h1>

      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[560px]">
          {isLoading && <CardSkeleton />}

          {!isLoading && !tutor && (
            <EmptyState onReset={() => setIdx(0)} />
          )}

          <AnimatePresence mode="popLayout">
            {tutor && (
              <motion.div
                key={tutor.id}
                className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Imagen (drag) */}
                <motion.img
                  src={tutor.avatar || "https://picsum.photos/seed/fallback/640/360"}
                  alt={tutor.name}
                  className="h-64 w-full rounded-t-xl object-cover"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  whileDrag={{ rotate: (dragInfo) => (typeof dragInfo === "number" ? dragInfo / 30 : 0), boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                  onDragEnd={onDragEnd}
                />

                {/* Info */}
                <div className="border-t px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-[#16A34A]">
                      {tutor.name}, {tutor.age}
                    </h3>
                    <div className="flex items-center gap-1 text-[#16A34A] text-sm">
                      <StarIcon className="h-4 w-4" /> {tutor.rating}
                    </div>
                  </div>

                  <p className="mt-1 text-[13px] text-gray-600">
                    <PinIcon className="mr-1 inline h-4 w-4" />
                    {tutor.city}
                  </p>
                  <p className="text-[13px] text-gray-600">
                    <ClockIcon className="mr-1 inline h-4 w-4" />
                    {tutor.schedule}
                  </p>

                  {/* Chips */}
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

                  <p className="mt-3 text-[12px] text-gray-600">{tutor.bio}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controles */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              onClick={skip}
              disabled={!tutor}
              className="grid h-12 w-12 place-items-center rounded-full border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Descartar"
            >
              ✖
            </button>
            <button
              onClick={() => tutor && like(tutor)}
              disabled={!tutor}
              className="grid h-12 w-12 place-items-center rounded-full bg-[#22C55E] text-white hover:bg-[#16A34A] disabled:opacity-50"
              aria-label="Me gusta"
            >
              ❤
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- UI helpers ---------- */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center text-gray-600">
      No hay más tutores para mostrar.
      <div className="mt-4">
        <button
          onClick={onReset}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="h-64 w-full rounded-t-xl bg-gray-200 animate-pulse" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
          <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
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
function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#6B7280" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 11h5v-2h-4V7h-2v6Z"/>
    </svg>
  );
}
