/**
 * Componente para seleccionar ubicación en el mapa
 * Útil para elegir origen/destino
 */

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix de iconos
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  initialPosition?: { latitud: number; longitud: number };
  onLocationSelect: (lat: number, lng: number) => void;
  altura?: string;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Ubicación seleccionada');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({
  initialPosition,
  onLocationSelect,
  altura = '300px',
}: LocationPickerProps) {
  const centro: [number, number] = initialPosition
    ? [initialPosition.latitud, initialPosition.longitud]
    : [-0.1807, -78.4678]; // Quito por defecto

  return (
    <div style={{ height: altura, width: '100%', position: 'relative' }}>
      <MapContainer
        center={centro}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '12px', cursor: 'crosshair' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>

      {/* Instrucción */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        📍 Toca el mapa para seleccionar ubicación
      </div>
    </div>
  );
}
