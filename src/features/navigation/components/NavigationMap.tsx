/**
 * Componente de Mapa para Navegación - OpenBlind
 * Usa Leaflet + OpenStreetMap (GRATIS, no requiere API Key)
 */

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RutaCalculada } from '../services/navigation.service';

// Fix de iconos de Leaflet (problema conocido con Webpack/Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 18px;
          font-weight: bold;
          color: white;
        ">${label}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const startIcon = createCustomIcon('#22c55e', 'A'); // Verde - Inicio
const endIcon = createCustomIcon('#ef4444', 'B');   // Rojo - Destino
const userIcon = createCustomIcon('#3b82f6', '👤'); // Azul - Usuario actual

interface NavigationMapProps {
  ruta?: RutaCalculada;
  posicionActual?: { latitud: number; longitud: number };
  altura?: string;
  zoom?: number;
  mostrarControles?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
}

// Componente interno para actualizar el centro del mapa
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function NavigationMap({
  ruta,
  posicionActual,
  altura = '400px',
  zoom = 15,
  mostrarControles = true,
  onMapClick,
}: NavigationMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Calcular centro del mapa
  const getCentro = (): [number, number] => {
    if (posicionActual) {
      return [posicionActual.latitud, posicionActual.longitud];
    }
    if (ruta) {
      return [ruta.inicio.latitud, ruta.inicio.longitud];
    }
    // Centro de Quito por defecto
    return [-0.1807, -78.4678];
  };

  // Convertir polyline a coordenadas para react-leaflet
  const getPolylineCoords = (): [number, number][] => {
    if (!ruta?.geometria?.coordinates) return [];

    // OpenRouteService devuelve [longitud, latitud], necesitamos [latitud, longitud]
    return ruta.geometria.coordinates.map((coord: number[]) => [
      coord[1], // latitud
      coord[0], // longitud
    ]);
  };

  const polylineCoords = getPolylineCoords();
  const centro = getCentro();

  return (
    <div style={{ height: altura, width: '100%', position: 'relative' }}>
      <MapContainer
        center={centro}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        zoomControl={mostrarControles}
        ref={mapRef}
        onClick={(e) => {
          if (onMapClick) {
            onMapClick(e.latlng.lat, e.latlng.lng);
          }
        }}
      >
        {/* Capa de OpenStreetMap - GRATIS */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Actualizar centro cuando cambie la posición */}
        <MapController center={centro} zoom={zoom} />

        {/* Marcador de inicio de ruta */}
        {ruta && (
          <Marker
            position={[ruta.inicio.latitud, ruta.inicio.longitud]}
            icon={startIcon}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>Origen</strong>
                <p style={{ margin: '4px 0' }}>{ruta.inicio.direccion}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador de destino de ruta */}
        {ruta && (
          <Marker
            position={[ruta.fin.latitud, ruta.fin.longitud]}
            icon={endIcon}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <strong>Destino</strong>
                <p style={{ margin: '4px 0' }}>{ruta.fin.direccion}</p>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  Distancia: {ruta.distancia.texto} | Tiempo: {ruta.duracion.texto}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador de posición actual del usuario */}
        {posicionActual && (
          <Marker
            position={[posicionActual.latitud, posicionActual.longitud]}
            icon={userIcon}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <strong>Tu ubicación actual</strong>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  {posicionActual.latitud.toFixed(6)}, {posicionActual.longitud.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Línea de la ruta (polyline) */}
        {polylineCoords.length > 0 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#3b82f6',
              weight: 5,
              opacity: 0.7,
            }}
          />
        )}
      </MapContainer>

      {/* Información de la ruta (overlay) */}
      {ruta && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxWidth: '250px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
            Información de Ruta
          </div>
          <div style={{ fontSize: '13px', color: '#555' }}>
            <div style={{ marginBottom: '4px' }}>
              📏 <strong>Distancia:</strong> {ruta.distancia.texto}
            </div>
            <div style={{ marginBottom: '4px' }}>
              ⏱️ <strong>Tiempo:</strong> {ruta.duracion.texto}
            </div>
            <div>
              🚶 <strong>Pasos:</strong> {ruta.pasos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
