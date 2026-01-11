/**
 * Hook para reconocimiento de voz - Speech Recognition API
 * Permite a los usuarios dar comandos de voz para navegar la app
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// Tipos para Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  keywords: string[]; // Palabras clave que activan el comando
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const commandsRef = useRef<VoiceCommand[]>([]);

  // Verificar soporte del navegador
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      setupRecognition();
    } else {
      setIsSupported(false);
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
    }
  }, []);

  // Configurar reconocimiento de voz
  const setupRecognition = () => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    recognition.continuous = true; // Escuchar continuamente
    recognition.interimResults = false; // Solo resultados finales
    recognition.lang = 'es-ES'; // Español

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      const lastResult = results[results.length - 1];

      if (lastResult.isFinal) {
        const text = lastResult[0].transcript.toLowerCase().trim();
        console.log('[VoiceRecognition] Comando escuchado:', text);
        setTranscript(text);

        // Buscar comando coincidente
        const matchedCommand = findMatchingCommand(text);
        if (matchedCommand) {
          console.log('[VoiceRecognition] Comando ejecutado:', matchedCommand.command);
          matchedCommand.action();
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[VoiceRecognition] Error:', event.error);

      if (event.error === 'no-speech') {
        setError('No se detectó voz. Intenta de nuevo.');
      } else if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado. Por favor habilítalo.');
      } else {
        setError(`Error de reconocimiento: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[VoiceRecognition] Reconocimiento detenido');
      setIsListening(false);

      // Reiniciar automáticamente si estaba escuchando
      if (isListening) {
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    recognition.onstart = () => {
      console.log('[VoiceRecognition] Reconocimiento iniciado');
      setIsListening(true);
      setError(null);
    };
  };

  // Buscar comando que coincida con el texto
  const findMatchingCommand = (text: string): VoiceCommand | null => {
    for (const command of commandsRef.current) {
      for (const keyword of command.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          return command;
        }
      }
    }
    return null;
  };

  // Iniciar escucha
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Reconocimiento de voz no disponible');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err: any) {
      if (err.message.includes('already started')) {
        console.warn('[VoiceRecognition] Ya está escuchando');
      } else {
        console.error('[VoiceRecognition] Error al iniciar:', err);
        setError(err.message);
      }
    }
  }, []);

  // Detener escucha
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Registrar comandos de voz
  const registerCommands = useCallback((commands: VoiceCommand[]) => {
    commandsRef.current = commands;
    console.log('[VoiceRecognition] Comandos registrados:', commands.length);
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    registerCommands,
  };
};
