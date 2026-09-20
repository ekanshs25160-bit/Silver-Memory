import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <div className="text-on-surface bg-background">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}
