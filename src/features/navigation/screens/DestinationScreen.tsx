import React, { useState, useRef } from 'react';
import { Layout } from '../../../shared/components/layout/Layout';
import { Navigation, Mic } from 'lucide-react';

export const DestinationScreen: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('El reconocimiento de voz no está disponible');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      speak('Di el destino');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDestination(transcript);
      speak(`Buscando ruta hacia ${transcript}`);
      searchDestination(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak('No pude escucharte bien');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const searchDestination = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setResult(data[0]);
        speak(`Destino encontrado: ${data[0].display_name}`);
      } else {
        speak('No encontré ese destino');
        setResult(null);
      }
    } catch (error) {
      console.error('Error buscando destino:', error);
      speak('Error al buscar el destino');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      searchDestination(destination);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-4xl font-black text-white mb-6">Nueva Ruta</h1>
        
        <div className="info-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                ¿A dónde quieres ir?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej: Parque La Carolina, Quito"
                  className="big-input"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    borderColor: 'rgba(185, 131, 255, 0.3)'
                  }}
                />
                <button
                  type="button"
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
                >
                  <Mic 
                    className="w-6 h-6" 
                    style={{ color: isListening ? '#FF4C4C' : '#B983FF' }} 
                  />
                </button>
              </div>
              {isListening && (
                <p className="text-white text-sm mt-2">🎤 Escuchando...</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!destination.trim()}
              className="big-button primary flex items-center justify-center gap-3"
            >
              <Navigation className="w-6 h-6" />
              <span>Buscar ruta</span>
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(185, 131, 255, 0.1)' }}>
              <h3 className="text-white font-bold mb-2">Destino encontrado:</h3>
              <p className="text-white text-sm">{result.display_name}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};