/**
 * Hook del Asistente de Voz - Guía al usuario en toda la app
 * Combina Speech Synthesis (hablar) y Speech Recognition (escuchar)
 */

import { useEffect, useRef, useCallback } from 'react';

export interface VoiceSettings {
  rate: number; // 0.5 a 2.0
  volume: number; // 0 a 1
  pitch: number; // 0 a 2
  lang: string; // 'es-ES'
}

export const useVoiceAssistant = () => {
  const isSpeakingRef = useRef(false);
  const queueRef = useRef<string[]>([]);
  const settingsRef = useRef<VoiceSettings>({
    rate: 1.3, // Más rápido para mejor UX
    volume: 1.0,
    pitch: 1.05, // Ligeramente más agudo para claridad
    lang: 'es-ES',
  });

  // Cargar configuración de voz desde localStorage (preferencias del usuario)
  useEffect(() => {
    const savedRate = localStorage.getItem('voiceRate');
    const savedVolume = localStorage.getItem('voiceVolume');

    if (savedRate) settingsRef.current.rate = parseFloat(savedRate);
    if (savedVolume) settingsRef.current.volume = parseFloat(savedVolume);
  }, []);

  // Verificar si está disponible
  const isAvailable = 'speechSynthesis' in window;

  // Hablar un texto
  const speak = useCallback((text: string, priority: 'high' | 'normal' = 'normal') => {
    if (!isAvailable) {
      console.warn('[VoiceAssistant] Speech Synthesis no disponible');
      return;
    }

    // Evitar duplicados - no hablar si ya está hablando exactamente lo mismo
    if (isSpeakingRef.current && window.speechSynthesis.speaking) {
      console.log('[VoiceAssistant] Ya hablando, ignorando duplicado:', text);
      return;
    }

    console.log('[VoiceAssistant] Hablar:', text);

    if (priority === 'high') {
      // Cancelar speech actual y hablar inmediatamente
      window.speechSynthesis.cancel();
      queueRef.current = [];
      // Pequeña pausa para asegurar que se canceló
      setTimeout(() => speakNow(text), 50);
    } else {
      // Agregar a la cola
      queueRef.current.push(text);
      processQueue();
    }
  }, [isAvailable]);

  // Hablar ahora (sin cola)
  const speakNow = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settingsRef.current.lang;
    utterance.rate = settingsRef.current.rate;
    utterance.volume = settingsRef.current.volume;
    utterance.pitch = settingsRef.current.pitch;

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      processQueue(); // Procesar siguiente en cola
    };

    utterance.onerror = (err) => {
      // Solo loguear errores no-triviales (ignorar "interrupted" que es normal)
      if (err.error !== 'interrupted' && err.error !== 'canceled') {
        console.error('[VoiceAssistant] Error:', err);
      }
      isSpeakingRef.current = false;
      processQueue();
    };

    // Asegurar que no hay nada hablando antes de empezar
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);
  };

  // Procesar cola de mensajes
  const processQueue = () => {
    if (isSpeakingRef.current || queueRef.current.length === 0) {
      return;
    }

    const nextText = queueRef.current.shift();
    if (nextText) {
      speakNow(nextText);
    }
  };

  // Detener speech actual
  const stop = useCallback(() => {
    if (isAvailable) {
      window.speechSynthesis.cancel();
      queueRef.current = [];
      isSpeakingRef.current = false;
    }
  }, [isAvailable]);

  // Pausar
  const pause = useCallback(() => {
    if (isAvailable) {
      window.speechSynthesis.pause();
    }
  }, [isAvailable]);

  // Reanudar
  const resume = useCallback(() => {
    if (isAvailable) {
      window.speechSynthesis.resume();
    }
  }, [isAvailable]);

  // Actualizar configuración
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    settingsRef.current = { ...settingsRef.current, ...newSettings };

    // Guardar en localStorage
    if (newSettings.rate !== undefined) {
      localStorage.setItem('voiceRate', newSettings.rate.toString());
    }
    if (newSettings.volume !== undefined) {
      localStorage.setItem('voiceVolume', newSettings.volume.toString());
    }
  }, []);

  // Dar bienvenida inicial
  const welcome = useCallback(() => {
    const welcomeText = 'Bienvenido a Open Blind, tu asistente de navegación accesible. ¿En qué podemos ayudarte?';
    speak(welcomeText, 'high');
  }, [speak]);

  // Anunciar página actual
  const announcePage = useCallback((pageName: string, options: string[]) => {
    let text = `Estás en ${pageName}.`;

    if (options.length > 0) {
      text += ' Opciones disponibles: ';
      text += options.join(', ');
      text += '. Di el nombre de la opción que deseas.';
    }

    speak(text, 'high');
  }, [speak]);

  // Anunciar acción completada
  const announceSuccess = useCallback((message: string) => {
    speak(`Éxito. ${message}`, 'high');
  }, [speak]);

  // Anunciar error
  const announceError = useCallback((message: string) => {
    speak(`Error. ${message}. Intenta de nuevo.`, 'high');
  }, [speak]);

  // Leer opciones de menú
  const readMenu = useCallback((menuItems: { name: string; description?: string }[]) => {
    let text = 'Menú principal. Opciones: ';

    menuItems.forEach((item, index) => {
      text += `${index + 1}, ${item.name}`;
      if (item.description) {
        text += `, ${item.description}`;
      }
      text += '. ';
    });

    text += 'Di el número o nombre de la opción que deseas.';
    speak(text, 'normal');
  }, [speak]);

  // Confirmar acción
  const confirm = useCallback((action: string, onYes: () => void, onNo: () => void) => {
    const text = `¿Estás seguro de ${action}? Di sí para confirmar o no para cancelar.`;
    speak(text, 'high');

    // Aquí se debería conectar con Speech Recognition
    // Por ahora solo hablamos
  }, [speak]);

  // Instrucción de ayuda
  const help = useCallback(() => {
    const helpText = `
      Para navegar por la aplicación, puedes usar comandos de voz.
      Di "inicio" para ir a la página principal.
      Di "menú" para escuchar todas las opciones.
      Di "ayuda" para escuchar estas instrucciones nuevamente.
      Di "repetir" para escuchar la última información.
      Di "atrás" para volver a la página anterior.
    `;
    speak(helpText, 'high');
  }, [speak]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isAvailable,
    speak,
    stop,
    pause,
    resume,
    updateSettings,
    welcome,
    announcePage,
    announceSuccess,
    announceError,
    readMenu,
    confirm,
    help,
  };
};
