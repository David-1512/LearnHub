import { Outlet } from "react-router-dom";
import {NavbarInicio,NavbarRegistro} from "../widgets/Navbar";

export function AppShellInicio() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarInicio />
          <Outlet />
    </div>
  );
}

export function AppShellRegistro() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarRegistro/>
          <Outlet />
    </div>
  );
}