import React, { useState, useEffect } from 'react';
import { Layout } from '../../../shared/components/layout/Layout';
import { MapPin } from 'lucide-react';

export const LocationScreen: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Obtener dirección usando Nominatim
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setAddress(data.display_name || 'Dirección no disponible');
          } catch (error) {
            setAddress('No se pudo obtener la dirección');
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener tu ubicación');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('La geolocalización no está disponible');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-4xl font-black text-white mb-6">Mi Ubicación</h1>
        
        <div className="info-card">
          {loading ? (
            <div className="text-center py-8">
              <div className="loading-spinner"></div>
              <p className="text-white mt-4">Obteniendo ubicación...</p>
            </div>
          ) : location ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8" style={{ color: '#B983FF' }} />
                <div>
                  <p className="text-white font-semibold text-lg">Ubicación actual</p>
                  <p className="text-white opacity-70 text-sm">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(185, 131, 255, 0.1)' }}>
                <p className="text-white text-sm">{address}</p>
              </div>

              <button
                onClick={getCurrentLocation}
                className="big-button primary mt-4"
              >
                Actualizar ubicación
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white mb-4">No se pudo obtener tu ubicación</p>
              <button
                onClick={getCurrentLocation}
                className="big-button primary"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};