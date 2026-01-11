/**
 * Hook completo de control por voz para toda la aplicación
 * Permite navegar y controlar TODO mediante comandos de voz
 */

import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';

interface VoiceControlOptions {
  enabled?: boolean;
  continuous?: boolean;
  onCommand?: (command: string) => void;
}

export const useVoiceControl = (options: VoiceControlOptions = {}) => {
  const { enabled = true, continuous = true, onCommand } = options;
  const { language, t, changeLanguage, speak } = useI18n();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition no está disponible en este navegador');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log('Comando de voz detectado:', transcript);

      if (onCommand) {
        onCommand(transcript);
      }

      processVoiceCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);

      if (event.error === 'no-speech') {
        // Reintentar si no se detectó voz
        setTimeout(() => {
          if (listeningRef.current) {
            recognition.start();
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Reiniciar automáticamente si continuous está activado
      if (continuous && listeningRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            // Ignorar error si ya está iniciado
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    // Iniciar escucha automáticamente
    if (continuous) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, [enabled, continuous, language]);

  // Procesar comando de voz
  const processVoiceCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase();

    // Navegación
    if (matchCommand(cmd, t('voiceCommands.navigation'))) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('navigation'), 'high');
      navigate('/navigation');
    }
    else if (matchCommand(cmd, t('voiceCommands.location'))) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('myLocation'), 'high');
      navigate('/location');
    }
    else if (matchCommand(cmd, t('voiceCommands.places'))) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('places'), 'high');
      navigate('/places');
    }
    else if (matchCommand(cmd, t('voiceCommands.emergency'))) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('emergency'), 'high');
      navigate('/emergency-contacts');
    }
    else if (matchCommand(cmd, t('voiceCommands.settings'))) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('settings'), 'high');
      navigate('/settings');
    }
    // Historial
    else if (cmd.includes('historial') || cmd.includes('history')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('history'), 'high');
      navigate('/history');
    }
    // Perfil
    else if (cmd.includes('perfil') || cmd.includes('profile')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('profile'), 'high');
      navigate('/profile');
    }
    // Soporte
    else if (cmd.includes('soporte') || cmd.includes('support') || cmd.includes('ayuda técnica')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('support'), 'high');
      navigate('/support');
    }
    // Incidencias
    else if (cmd.includes('incidencias') || cmd.includes('incidents') || cmd.includes('reportes')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('incidents'), 'high');
      navigate('/incidents');
    }
    // Tarjeta
    else if (cmd.includes('tarjeta') || cmd.includes('card') || cmd.includes('identificación')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('myCard'), 'high');
      navigate('/view-card');
    }
    // Inicio
    else if (cmd.includes('inicio') || cmd.includes('home') || cmd.includes('menú principal')) {
      speak(t('voiceMessages.navigatingTo') + ' ' + t('mainMenu'), 'high');
      navigate('/');
    }
    // Volver
    else if (matchCommand(cmd, t('voiceCommands.back'))) {
      speak(t('back'), 'high');
      navigate(-1);
    }
    // Modo oscuro
    else if (matchCommand(cmd, t('voiceCommands.darkMode'))) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('openblind-theme', 'dark');
      speak(t('voiceMessages.darkModeEnabled'), 'high');
    }
    // Modo claro
    else if (matchCommand(cmd, t('voiceCommands.lightMode'))) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('openblind-theme', 'light');
      speak(t('voiceMessages.lightModeEnabled'), 'high');
    }
    // Cambiar idioma
    else if (cmd.includes('inglés') || cmd.includes('english')) {
      changeLanguage('en');
    }
    else if (cmd.includes('español') || cmd.includes('spanish')) {
      changeLanguage('es');
    }
    else {
      speak(t('voiceMessages.commandNotUnderstood'), 'medium');
    }
  }, [navigate, t, speak, changeLanguage]);

  // Verificar si el comando coincide con alguna opción
  const matchCommand = (command: string, options: string | string[]): boolean => {
    const opts = Array.isArray(options) ? options : [options];
    return opts.some(opt => command.includes(opt.toLowerCase()));
  };

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (recognitionRef.current && !listeningRef.current) {
      try {
        recognitionRef.current.start();
        listeningRef.current = true;
        speak(t('voiceMessages.listeningCommand'), 'low');
      } catch (e) {
        console.error('Error al iniciar reconocimiento:', e);
      }
    }
  }, [speak, t]);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (recognitionRef.current && listeningRef.current) {
      recognitionRef.current.stop();
      listeningRef.current = false;
    }
  }, []);

  // Escuchar un comando único
  const listenOnce = useCallback((callback?: (transcript: string) => void) => {
    if (!recognitionRef.current) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'es' ? 'es-ES' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      if (callback) {
        callback(transcript);
      } else {
        processVoiceCommand(transcript);
      }
    };

    recognition.start();
    speak(t('voiceMessages.listeningCommand'), 'low');
  }, [language, speak, t, processVoiceCommand]);

  return {
    startListening,
    stopListening,
    listenOnce,
    isListening: listeningRef.current,
  };
};
