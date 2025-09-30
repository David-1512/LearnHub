import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import {AppShellInicio, AppShellRegistroLogin, AppShellStudent, AppShellTutor} from "./AppShell";
import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import RegisterPage from "../pages/register";
import TutorDash from "../pages/dashboard-tutor";
import StudentDash from "../pages/dashboard-student";
import { AuthProvider } from "../auth/AuthContext";
import RequireRole from "./router/RequireRole";

const router = createBrowserRouter([
   // Layout principal (navbar de inicio)
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
   

  {
   path: "tutor",
    element: (
       <RequireRole allow={["tutor", "admin"]}>
          <AppShellTutor/>
        </RequireRole>
    ),
    children: [
      { index: true, element: <TutorDash /> }
    ]
  },

  {
   path: "student",
    element: (
       <RequireRole allow={["student", "admin"]}>
          <AppShellStudent/>
        </RequireRole>
    ),
    children: [
      { index: true, element: <StudentDash /> }
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