export default function TutorDash() {
  return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-center text-2xl font-semibold text-gray-800">Descubre Tutores</h1>

        <section className="mt-6 flex justify-center">
          <article className="w-full max-w-xl rounded-xl border border-gray-200 bg-[#F5F9F7] overflow-hidden shadow-sm">
            {/* Illustration / Photo */}
            <div className="bg-white">
              {/* Replace src with your image; aspect ratio kept */}
              <div className="w-full h-56 bg-[#E9EEF0] flex items-center justify-center">
                <TeacherIllustration className="w-72 h-40" />
              </div>
            </div>

            {/* Content */}
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[#2BB24C] font-semibold">María González, 25</h2>
                <div className="flex items-center gap-1 text-sm">
                  <StarIcon className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-gray-700 font-medium">4.9</span>
                </div>
              </div>

              <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  Heredia, San Joaquín
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  Lun - Vie 2 - 8pm
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">Matemáticas</span>
                <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">Física</span>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Estudiante de cuarto semestre de la enseñanza de la matemática.
              </p>
            </div>
          </article>
        </section>

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-center gap-8">
          <button
            aria-label="Descartar"
            className="h-14 w-14 rounded-full border border-gray-300 bg-white grid place-items-center shadow-sm hover:shadow transition"
          >
            <XIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button
            aria-label="Me gusta"
            className="h-14 w-14 rounded-full bg-[#2BB24C] grid place-items-center text-white shadow hover:brightness-95 transition"
          >
            <HeartIcon className="w-6 h-6" />
          </button>
        </div>
      </main>
  );
}

/* ---------------- Icons / Illustration ---------------- */

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}
function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41l3.29 1.9-.98 1.7L11 13V6h2v6.41z" />
    </svg>
  );
}
function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/* Simple teacher illustration to mimic the style */
function TeacherIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden>
      <rect x="200" y="35" width="100" height="70" rx="6" fill="#F3F4F6" stroke="#D1D5DB" />
      <rect x="28" y="20" width="140" height="140" rx="12" fill="#FDF2F2" stroke="#E5E7EB" />
      <circle cx="98" cy="76" r="28" fill="#111827" />
      <rect x="68" y="94" width="100" height="46" rx="10" fill="#FDE68A" stroke="#F59E0B" />
      <rect x="78" y="104" width="80" height="8" rx="4" fill="#34D399" />
      <rect x="78" y="118" width="80" height="8" rx="4" fill="#60A5FA" />
      <path d="M260 70h34" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 21s-7.5-4.35-9.33-8.36C1.48 9.8 3.3 7 6.22 7c1.7 0 3.08.83 3.78 2.02C10.7 7.83 12.08 7 13.78 7c2.93 0 4.74 2.8 3.56 5.64C19.5 16.65 12 21 12 21z" />
    </svg>
  );
}
