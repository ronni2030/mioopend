/**
 * Servicio de Geocodificación - Solo Ecuador
 * Usa Nominatim (OpenStreetMap) GRATIS
 */

export interface GeocodingResult {
  address: string;
  lat: number;
  lon: number;
  displayName: string;
  country: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

/**
 * Buscar lugares en Ecuador usando Nominatim
 */
export const searchPlacesEcuador = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        countrycodes: 'ec', // SOLO ECUADOR
        limit: '10',
        addressdetails: '1',
        'accept-language': 'es',
      }),
      {
        headers: {
          'User-Agent': 'OpenBlind Navigation App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error en búsqueda de lugares');
    }

    const data = await response.json();

    return data.map((item: any) => ({
      address: item.address?.road || item.address?.neighbourhood || item.name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
      country: item.address?.country || 'Ecuador',
    }));
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return [];
  }
};

/**
 * Geocodificación inversa - Obtener dirección desde coordenadas
 */
export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/reverse?` +
      new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        'accept-language': 'es',
        zoom: '18',
      }),
      {
        headers: {
          'User-Agent': 'OpenBlind Navigation App',
        },
      }
    );

    if (!response.ok) {
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }

    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
};

/**
 * Obtener ubicación actual del usuario
 */
export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Obtener dirección de la ubicación actual
 */
export const getCurrentAddress = async (): Promise<string> => {
  try {
    const location = await getCurrentLocation();
    const address = await reverseGeocode(location.lat, location.lon);
    return address;
  } catch (error) {
    console.error('Error obteniendo dirección actual:', error);
    throw error;
  }
};
