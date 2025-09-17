import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

registerSW();

// Listen for beforeinstallprompt and pass to App via window
window.deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  // Custom event to notify App component
  window.dispatchEvent(new Event("pwa-install-available"));
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
