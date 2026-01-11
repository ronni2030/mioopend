/**
 * Navegación - Diseño estético modular funcional
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import NavigationMap from '../features/navigation/components/NavigationMap';
import { navigationService, type RutaCalculada } from '../features/navigation/services/navigation.service';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Input } from '../shared/components/ui';

const NavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [destination, setDestination] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [calculatedRoute, setCalculatedRoute] = useState<RutaCalculada | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setOrigin(pos);
          setCurrentPosition(pos);
          speak('Ubicación de origen obtenida');
        },
        (error) => {
          console.error('Error GPS:', error);
          speak('No se pudo obtener ubicación de origen', 'high');
        }
      );
    }
  }, []);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speak('El reconocimiento de voz no está disponible', 'high');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      speak('Di el destino', 'high');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDestination(transcript);
      speak(`Buscando ruta hacia ${transcript}`, 'high');
      searchDestination(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speak('No pude escucharte bien', 'high');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const searchDestination = async (query: string) => {
    if (!query.trim()) return;

    try {
      speak('Buscando destino');
      // Limitar búsqueda a Quito, Ecuador
      const searchQuery = `${query}, Quito, Ecuador`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=ec&bounded=1&viewbox=-78.6,-0.4,-78.4,0.0`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSearchResults(data);
        speak(`${data.length} resultados encontrados`, 'high');
      } else {
        speak('No encontré ese destino', 'high');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error buscando destino:', error);
      speak('Error al buscar el destino', 'high');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      searchDestination(destination);
    }
  };

  const selectDestination = async (result: any) => {
    const dest = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name,
    };
    setSelectedDestination(dest);
    setSearchResults([]);

    if (origin) {
      setIsCalculatingRoute(true);
      speak('Calculando ruta', 'high');

      try {
        const response = await navigationService.calcularRuta({
          idUsuario: 1, // TODO: Obtener del contexto de usuario
          origen: { latitud: origin.lat, longitud: origin.lng },
          destino: { latitud: dest.lat, longitud: dest.lng }
        });

        setCalculatedRoute(response.ruta);
        setShowMap(true);

        const distanceKm = (response.ruta.distancia.valor / 1000).toFixed(2);
        const durationMin = Math.ceil(response.ruta.duracion.valor / 60);
        speak(`Ruta calculada: ${distanceKm} kilómetros, ${durationMin} minutos`, 'high');
      } catch (error) {
        console.error('Error calculando ruta:', error);
        speak('No se pudo calcular la ruta', 'high');
      } finally {
        setIsCalculatingRoute(false);
      }
    }
  };

  return (
    <PageLayout title="Navegación">
      <div className="space-y-4">
        {!showMap ? (
          <>
            {/* Formulario de búsqueda */}
            <Card className="stagger-item">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-purple-200 drop-shadow">
                    ¿A dónde quieres ir?
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ej: Parque La Carolina, Quito"
                      className="pr-14"
                    />
                    <button
                      type="button"
                      onClick={startVoiceInput}
                      disabled={isListening}
                      className="absolute right-3 top-[38px] transform -translate-y-1/2 text-3xl hover:scale-110 smooth-transition"
                    >
                      {isListening ? '🔴' : '🎤'}
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-sm mt-2 text-purple-300 gentle-pulse">🎤 Escuchando...</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!destination.trim()}
                >
                  🔍 Buscar Destino
                </Button>
              </form>
            </Card>

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">Resultados ({searchResults.length})</h3>
                {searchResults.map((result, index) => (
                  <Card
                    key={index}
                    onClick={() => selectDestination(result)}
                    hover
                    className="stagger-item cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 bounce-soft shadow-lg">
                        📍
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm line-clamp-2 drop-shadow">{result.display_name}</p>
                        <p className="text-xs text-purple-300 mt-1">{result.type}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Mapa con ruta */}
            <Card className="overflow-hidden p-0 stagger-item" style={{ height: '380px' }}>
              {isCalculatingRoute ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-3"></div>
                  <p className="text-purple-200 font-semibold">Calculando ruta...</p>
                </div>
              ) : calculatedRoute && currentPosition ? (
                <NavigationMap
                  ruta={calculatedRoute}
                  posicionActual={{ latitud: currentPosition.lat, longitud: currentPosition.lng }}
                  altura="380px"
                  zoom={13}
                />
              ) : null}
            </Card>

            {calculatedRoute && (
              <Card className="stagger-item">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 rounded-full w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0 bounce-soft shadow-lg">
                    🎯
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-purple-200">Destino</p>
                    <p className="font-bold text-sm line-clamp-2 drop-shadow">{selectedDestination?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
                    <p className="text-xs text-purple-200 mb-1">Distancia</p>
                    <p className="font-bold drop-shadow">📏 {calculatedRoute.distancia.texto}</p>
                  </div>
                  <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
                    <p className="text-xs text-purple-200 mb-1">Duración</p>
                    <p className="font-bold drop-shadow">⏱️ {calculatedRoute.duracion.texto}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowMap(false);
                  setSelectedDestination(null);
                  setCalculatedRoute(null);
                  setSearchResults([]);
                  setDestination('');
                  speak('Búsqueda cancelada');
                }}
                variant="danger"
                className="flex-1"
              >
                ❌ Cancelar
              </Button>
              <Button
                onClick={() => speak('Iniciando navegación', 'high')}
                variant="success"
                className="flex-1"
              >
                ▶️ Iniciar
              </Button>
            </div>
          </>
        )}

        {/* Botón de acceso rápido a ubicación */}
        {!showMap && (
          <Button onClick={() => navigate('/location')} variant="secondary" fullWidth className="stagger-item">
            📍 Ver Mi Ubicación
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default NavigationPage;