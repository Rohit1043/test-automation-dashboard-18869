import React from "react";
import "./App.css";
import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastHost } from "./components/ToastHost";

// PUBLIC_INTERFACE
function App() {
  /** Root React component for the Test Automation Dashboard. */
  return (
    <ToastProvider>
      <AuthProvider>
        <UIProvider>
          <AppRouter />
          <ToastHost />
        </UIProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
