import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VoiceNavigationOptions {
  onCommand?: (command: string) => void;
  enabled?: boolean;
}

export const useVoiceNavigation = ({ onCommand, enabled = true }: VoiceNavigationOptions = {}) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('❌ El navegador no soporta reconocimiento de voz');
      return;
    }

    isActiveRef.current = true;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let restartTimeout: NodeJS.Timeout;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();
      setLastCommand(command);

      if (command.includes('crear') || command.includes('agregar') || command.includes('nuevo')) {
        speak('Abriendo formulario');
        setTimeout(() => navigate('/places/add'), 1500);
      } else if (command.includes('escuchar') || command.includes('leer') || command.includes('lista')) {
        if (onCommand) onCommand(command);
      } else if (command.includes('inicio') || command.includes('volver')) {
        speak('Volviendo al inicio');
        setTimeout(() => navigate('/places'), 1500);
      } else {
        if (onCommand) onCommand(command);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        isActiveRef.current = false;
        return;
      }
      
      if (isActiveRef.current && event.error !== 'aborted') {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
          if (isActiveRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignorar
            }
          }
        }, 2000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      
      if (isActiveRef.current) {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
          if (isActiveRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignorar
            }
          }
        }, 1500);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      console.error('❌ Error al iniciar:', e);
    }

    return () => {
      isActiveRef.current = false;
      clearTimeout(restartTimeout);
      try {
        recognition.stop();
      } catch (e) {
        // Ignorar
      }
    };
  }, [enabled, navigate, onCommand]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          const spanishVoice = availableVoices.find(voice => voice.lang.includes('es'));
          if (spanishVoice) {
            utterance.voice = spanishVoice;
          }
          window.speechSynthesis.speak(utterance);
        };
      } else {
        const spanishVoice = voices.find(voice => voice.lang.includes('es'));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        // Ignorar
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Ignorar
      }
    }
  };

  return {
    isListening,
    lastCommand,
    stopListening,
    startListening,
    speak,
  };
};