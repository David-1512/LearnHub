import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import {AppShellInicio, AppShellRegistroLogin, AppShellStudent, AppShellTutor} from "./AppShell";
import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import RegisterPage from "../pages/register";
import TutorDash from "../pages/dashboard-tutor";
import TutorProfile from "../pages/profile-tutor";
import StudentDash from "../pages/dashboard-student";
import { AuthProvider } from "../auth/AuthContext";
import RequireRole from "./router/RequireRole";
import StudentPublicProfile from "../pages/public-student-profile";
import StudentMatches from "../pages/student-matches";
import TutorPublicProfile from "../pages/tutor-public-profile";
import StudentProfile from "../pages/profile-student";

const router = createBrowserRouter([
   // Layout principal
  {
    path: "/",                   
    element: <AppShellInicio />,
    children: [
      { index: true, element: <HomePage /> }
    ],
  },
  // Layout del registro y login 
  {
   
    element: <AppShellRegistroLogin />,
    children: [
      {  path: "/register", element: <RegisterPage /> }, 
      { path: "/login", element: <LoginPage /> }
    ],
  },
   
  //Layout de tutor
  {
   path: "tutor",
    element: (
       <RequireRole allow={["tutor", "admin"]}>
          <AppShellTutor/>
        </RequireRole>
    ),
    children: [
     { index: true, element: <Navigate to="students" replace /> },

    // lista Mis estudiantes
    { path: "students", element: <TutorDash /> },

    // perfil de un estudiante
    { path: "students/:studentId", element: <StudentPublicProfile /> },

    // perfil del tutor
    { path: "profile/:tutorId", element: <TutorProfile /> },
    ]
  },

  //Layout de estudiante
  {
   path: "student",
    element: (
       <RequireRole allow={["student", "admin"]}>
          <AppShellStudent/>
        </RequireRole>
    ),
    children: [
      // Descubrir (Tinder)
    { index: true, element: <StudentDash /> },

    // Mis tutores 
    { path: "tutors", element: <StudentMatches /> },

    // Perfil publico de un tutor 
    { path: "tutors/:tutorId", element: <TutorPublicProfile /> },

    // Perfil de un studiante
    { path: "profile/:studentId", element: <StudentProfile /> },
    ]
  },

  // Cualquier otra ruta → redirige a Home
  { path: "*", element: <Navigate to="/" replace /> },
]);
const queryClient = new QueryClient();

export default function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>             
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}