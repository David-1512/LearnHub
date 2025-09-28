import { Outlet } from "react-router-dom";
import Navbar from "../widgets/Navbar";

export default function AppShell() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <Navbar />
          <Outlet />
    </div>
  );
}