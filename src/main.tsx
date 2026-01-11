import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App.tsx";
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { VoiceNavigationProvider } from './shared/contexts/VoiceNavigationContext';
import { I18nProvider } from './i18n/i18nContext';
import "./features/users/styles/index.css";
import "./index.css";
import "./styles.css";
import "./animations.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <VoiceNavigationProvider>
            <App />
          </VoiceNavigationProvider>
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);