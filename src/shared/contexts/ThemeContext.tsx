/**
 * Contexto de tema con soporte para alto contraste
 * Diseñado para personas daltónicas y con baja visión
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'high-contrast';
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface ThemeContextType {
  mode: ThemeMode;
  fontSize: FontSize;
  setMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');

  // Cargar preferencias desde localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;

    if (savedMode) setModeState(savedMode);
    if (savedFontSize) setFontSizeState(savedFontSize);
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;

    // Limpiar clases anteriores
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');

    // Aplicar nuevas clases
    root.classList.add(mode);
    root.classList.add(`font-${fontSize}`);

    // Aplicar estilos específicos de alto contraste
    if (mode === 'high-contrast') {
      root.style.setProperty('--color-bg', '#000000');
      root.style.setProperty('--color-text', '#FFFF00');
      root.style.setProperty('--color-primary', '#00FF00');
      root.style.setProperty('--color-secondary', '#00FFFF');
      root.style.setProperty('--color-error', '#FF0000');
      root.style.setProperty('--color-warning', '#FFA500');
      root.style.setProperty('--color-success', '#00FF00');
      root.style.setProperty('--color-border', '#FFFFFF');
    } else if (mode === 'dark') {
      root.style.setProperty('--color-bg', '#1a1a1a');
      root.style.setProperty('--color-text', '#ffffff');
      root.style.setProperty('--color-primary', '#3b82f6');
      root.style.setProperty('--color-secondary', '#8b5cf6');
      root.style.setProperty('--color-error', '#ef4444');
      root.style.setProperty('--color-warning', '#f59e0b');
      root.style.setProperty('--color-success', '#10b981');
      root.style.setProperty('--color-border', '#374151');
    } else {
      root.style.setProperty('--color-bg', '#ffffff');
      root.style.setProperty('--color-text', '#1f2937');
      root.style.setProperty('--color-primary', '#3b82f6');
      root.style.setProperty('--color-secondary', '#8b5cf6');
      root.style.setProperty('--color-error', '#ef4444');
      root.style.setProperty('--color-warning', '#f59e0b');
      root.style.setProperty('--color-success', '#10b981');
      root.style.setProperty('--color-border', '#d1d5db');
    }

    // Aplicar tamaños de fuente
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '20px',
      'extra-large': '24px',
    };
    root.style.setProperty('--font-size-base', fontSizes[fontSize]);
  }, [mode, fontSize]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('themeMode', newMode);

    // Feedback de voz
    if ('speechSynthesis' in window) {
      let modeText = '';
      if (newMode === 'high-contrast') modeText = 'Modo alto contraste activado';
      else if (newMode === 'dark') modeText = 'Modo oscuro activado';
      else modeText = 'Modo claro activado';

      const utterance = new SpeechSynthesisUtterance(modeText);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem('fontSize', newSize);

    // Feedback de voz
    if ('speechSynthesis' in window) {
      const sizeText = {
        small: 'pequeño',
        medium: 'mediano',
        large: 'grande',
        'extra-large': 'extra grande',
      };

      const utterance = new SpeechSynthesisUtterance(
        `Tamaño de fuente ${sizeText[newSize]} activado`
      );
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleHighContrast = () => {
    setMode(mode === 'high-contrast' ? 'light' : 'high-contrast');
  };

  const value: ThemeContextType = {
    mode,
    fontSize,
    setMode,
    setFontSize,
    toggleHighContrast,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
