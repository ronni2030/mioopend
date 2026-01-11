/**
 * Contexto de Internacionalización con persistencia en BD
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
  speak: (text: string, priority?: 'low' | 'medium' | 'high') => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Cargar idioma desde localStorage
    const savedLang = localStorage.getItem('openblind-language');
    return (savedLang as Language) || 'es';
  });

  // Función para obtener traducción
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Si no encuentra la clave, devolver la clave misma
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // Función para cambiar idioma
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('openblind-language', lang);

    // TODO: Persistir en BD cuando tengamos el usuario logueado
    // await updateUserPreferences({ language: lang });

    // Hablar el cambio
    speak(t('voiceMessages.languageChanged') + ' ' + t(lang === 'es' ? 'spanish' : 'english'));
  };

  // Función para texto a voz
  const speak = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if ('speechSynthesis' in window) {
      // Cancelar mensajes anteriores si la prioridad es alta
      if (priority === 'high') {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Actualizar el idioma del HTML
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage, speak }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
