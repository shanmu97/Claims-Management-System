import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import { PolicyProvider } from "./Contexts/PoliciesContext.jsx";

createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <PolicyProvider>
      <App />
      </PolicyProvider>
    </AuthProvider>
  
);
