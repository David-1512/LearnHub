import { createRoot } from "react-dom/client";
import AppRoot from "./app";         
import "./styles/tailwind.css"; 
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);