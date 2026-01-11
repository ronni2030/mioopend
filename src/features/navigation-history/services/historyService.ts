import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';
import type { Route } from '../types/history.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface HistorialRutaBackend {
  idHistorial?: number;
  idUsuario: number;
  origenNombre: string;
  origenLatitud: number;
  origenLongitud: number;
  destinoNombre: string;
  destinoLatitud: number;
  destinoLongitud: number;
  distancia: number;
  duracion: number;
  esFavorita: boolean;
  createdAt?: string;
}

export const historyService = {
  getHistory: async (idUsuario: number): Promise<Route[]> => {
    try {
      const response = await api.get<ApiResponse<HistorialRutaBackend[]>>(
        API_ENDPOINTS.historialRutas.porUsuario(idUsuario)
      );

      return response.data.data.map(ruta => ({
        id: ruta.idHistorial?.toString() || '',
        origin: ruta.origenNombre,
        destination: ruta.destinoNombre,
        date: ruta.createdAt || new Date().toISOString(),
        distance: `${(ruta.distancia / 1000).toFixed(2)} km`,
        duration: `${Math.ceil(ruta.duracion / 60)} min`,
        isFavorite: ruta.esFavorita,
      }));
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  },

  saveRoute: async (route: Route, idUsuario: number): Promise<void> => {
    try {
      if (route.id && route.isFavorite !== undefined) {
        // Marcar como favorita
        await api.put<ApiResponse<HistorialRutaBackend>>(
          API_ENDPOINTS.historialRutas.marcarFavorita(parseInt(route.id)),
          { esFavorita: route.isFavorite }
        );
      }
    } catch (error) {
      console.error('Error guardando ruta:', error);
      throw error;
    }
  },

  deleteRoute: async (id: string): Promise<void> => {
    try {
      await api.delete<ApiResponse<void>>(
        API_ENDPOINTS.historialRutas.eliminar(parseInt(id))
      );
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      throw error;
    }
  },

  clearHistory: async (idUsuario: number): Promise<void> => {
    try {
      await api.delete<ApiResponse<void>>(
        API_ENDPOINTS.historialRutas.limpiar(idUsuario)
      );
    } catch (error) {
      console.error('Error limpiando historial:', error);
      throw error;
    }
  }
};
