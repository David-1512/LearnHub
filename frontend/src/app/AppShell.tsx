import { Outlet } from "react-router-dom";
import {NavbarInicio,NavbarRegistroLogin, NavbarStudent} from "../widgets/Navbar";
import { useIdleLogout } from "../auth/useIdLeLogout";
import { useLogoutOnClose } from "../auth/useLogoutOnClose";

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
   useIdleLogout(15 * 60 * 1000);
   useLogoutOnClose();
   return (
    <div  className="min-h-screen bg-white text-gray-900">
          <NavbarStudent/>
          <Outlet />
    </div>
  );
}