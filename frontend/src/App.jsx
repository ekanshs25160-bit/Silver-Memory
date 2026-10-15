import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes";
import SlowBackendBanner from "./components/ui/SlowBackendBanner";

export default function App() {
  return (
    <div className="text-on-surface bg-background">
      <SlowBackendBanner />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}
