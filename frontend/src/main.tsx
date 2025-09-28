import { createRoot } from "react-dom/client";
import AppRoot from "./app";          // <- cambia a ./app
import "./styles/tailwind.css";     // <- tu hoja global

createRoot(document.getElementById("root")!).render(<AppRoot />);

