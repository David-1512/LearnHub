import { useStudents } from "../../features/students/api";

export default function TutorDash() {
  const { data, isLoading } = useStudents();

  return (
    <main className="px-4 py-6">
      <h1 className="text-center text-2xl font-semibold text-gray-800">Mis Estudiantes</h1>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {isLoading ? (
          <div>Cargando...</div>  
        ) : (
          data?.map((student) => (
            <div
              key={student.id}
              className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-md"
            >
              {/* Avatar */}
              <img
                src={student.avatar}
                alt={student.name}
                className="w-28 h-28 rounded-full object-cover"
              />
              <div className="text-center">
                {/* Nombre y edad */}
                <h3 className="text-lg font-semibold text-[#16A34A]">
                  {student.name}, {student.age}
                </h3>
                {/* Ciudad */}
                <p className="text-sm text-gray-500">{student.city}</p>
                {/* Match Duration */}
                <p className="text-sm text-gray-400">Match hace {student.matchDuration}</p>
              </div>

              {/* Botones */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => alert(`Ver perfil de ${student.name}`)} // Aquí poner la acción de "Ver Perfil"
                  className="rounded-md bg-[#2BB24C] text-white px-4 py-2"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => alert(`Retirar a ${student.name}`)} // Aquí poner la acción de "Retirar"
                  className="rounded-md bg-red-500 text-white px-4 py-2"
                >
                  Retirar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
