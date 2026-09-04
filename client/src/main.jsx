import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { SavedPropertiesProvider } from "./context/SavedPropertiesContext";
import { CompareProvider } from "./context/CompareContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedPropertiesProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </SavedPropertiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
