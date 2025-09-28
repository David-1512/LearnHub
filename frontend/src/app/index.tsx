import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppShell from "./AppShell";
import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import RegisterPage from "../pages/register";
import TutorDash from "../pages/dashboard-tutor";
import StudentDash from "../pages/dashboard-student";

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage/> },
      { path: "/tutor", element: <TutorDash /> },
      { path: "/student", element: <StudentDash /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
   { path: "/register", element: <RegisterPage /> },
  { path: "*", element: <div>404</div> },
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