import { Outlet } from "react-router-dom";
import {NavbarInicio,NavbarRegistroLogin} from "../widgets/Navbar";

export function AppShellInicio() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarInicio />
          <Outlet />
    </div>
  );
}

export function AppShellRegistroLogin() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarRegistroLogin/>
          <Outlet />
    </div>
  );
}