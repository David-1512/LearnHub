import {useNavigate } from "react-router-dom";

export default function HomePage() {
const navigate = useNavigate();
  return (
         <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-4 pb-24 text-center">
        <h1 className="font-bold tracking-tight leading-tight text-[44px] sm:text-[64px]">
          <span>Conecta con el </span>
          <span className="text-[#2BB24C]">tutor </span>
          <span className="text-[#2BB24C]">perfecto</span>
          <span>{" "}para ti</span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
          Encuentra tutores expertos en tu área de estudio o comparte tu conocimiento ayudando a otros
          estudiantes. Una plataforma moderna y fácil de usar.
        </p>

        <div className="mt-10 flex items-center justify-center gap-5">
          <button
          onClick={() => navigate("/register")}
          className="px-6 sm:px-7 py-3 rounded-md bg-[#2BB24C] text-white text-lg font-semibold hover:brightness-95 transition">
            Soy Estudiante
          </button>
          <button 
           onClick={() => navigate("/register")}
          className="px-6 sm:px-7 py-3 rounded-md border border-gray-300 bg-white text-gray-700 text-lg font-semibold hover:shadow-sm transition">
            Soy Tutor
          </button>
        </div>
      </main>
  );
}