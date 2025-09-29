import { Outlet } from "react-router-dom";
import {NavbarInicio,NavbarRegistroLogin, NavbarStudent} from "../widgets/Navbar";

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


export function AppShellStudent() {
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarStudent/>
          <Outlet />
    </div>
  );
}