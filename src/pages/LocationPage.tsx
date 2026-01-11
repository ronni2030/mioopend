/**
 * Mi Ubicación - Diseño estético modular funcional
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import NavigationMap from '../features/navigation/components/NavigationMap';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card } from '../shared/components/ui/Card';
import { Button } from '../shared/components/ui/Button';

const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    speak('Obteniendo ubicación actual');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const addressText = data.display_name || 'Dirección no disponible';
            setAddress(addressText);
            speak(`Ubicación obtenida: ${addressText}`, 'high');
          } catch (error) {
            setAddress('No se pudo obtener la dirección');
            speak('Ubicación obtenida pero sin dirección', 'high');
          }

          setLoading(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          speak('No se pudo obtener tu ubicación', 'high');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      speak('La geolocalización no está disponible', 'high');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <PageLayout title="Mi Ubicación">
      <div className="space-y-4">
        {/* Mapa */}
        <Card className="overflow-hidden p-0 stagger-item" style={{ height: '320px' }}>
          {location ? (
            <NavigationMap
              posicionActual={{ latitud: location.lat, longitud: location.lng }}
              altura="320px"
              zoom={15}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-purple-200">Esperando ubicación GPS...</p>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="stagger-item">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
              <p className="text-purple-200 mt-3 font-semibold">Obteniendo ubicación...</p>
            </div>
          ) : location ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 rounded-full w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0 bounce-soft shadow-lg">
                  📍
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg drop-shadow-lg">Ubicación Actual</p>
                  <p className="text-sm text-purple-200 font-mono">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {address && (
                <div className="mt-3 p-4 bg-purple-900/30 backdrop-blur-sm rounded-xl text-sm border border-purple-500/30 shadow-inner">
                  <p className="text-purple-100 leading-relaxed">{address}</p>
                </div>
              )}

              <Button onClick={getCurrentLocation} variant="primary" fullWidth className="mt-4">
                🔄 Actualizar Ubicación
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-white mb-4 font-semibold">No se pudo obtener tu ubicación</p>
              <Button onClick={getCurrentLocation} variant="primary" fullWidth>
                🔄 Reintentar
              </Button>
            </div>
          )}
        </Card>

        {/* Botón Calcular Ruta */}
        {location && (
          <Button onClick={() => navigate('/navigation')} variant="success" fullWidth className="stagger-item">
            🧭 Calcular Ruta desde Aquí
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default LocationPage;
