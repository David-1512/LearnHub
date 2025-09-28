import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import {AppShellInicio, AppShellRegistro} from "./AppShell";
import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import RegisterPage from "../pages/register";
import TutorDash from "../pages/dashboard-tutor";
import StudentDash from "../pages/dashboard-student";

const router = createBrowserRouter([
   // Layout principal (navbar de inicio)
  {
    path: "/",                    // ⬅️ raíz del sitio
    element: <AppShellInicio />,
    children: [
      { index: true, element: <HomePage /> },   // ⬅️ "/" muestra Home
      { path: "tutor", element: <TutorDash /> },    // ⬅️ rutas relativas
      { path: "student", element: <StudentDash /> },
    ],
  },
  // Layout del registro (navbar de registro)
  {
    path: "/register",
    element: <AppShellRegistro />,
    children: [
      { index: true, element: <RegisterPage /> },   // ⬅️ "/register"
    ],
  },

  { path: "/login", element: <LoginPage /> },

  // Cualquier otra ruta → redirige a Home
  { path: "*", element: <Navigate to="/" replace /> },
]);
const queryClient = new QueryClient();

export default function AppRoot() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}