import api from '../../../services/api/client';
import type { Route } from '../types/history.types';

export const historyService = {
  getHistory: async (): Promise<Route[]> => {
    try {
      const response = await api.get('/rutas/historial/2');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      // Retornar datos de ejemplo si falla
      return [];
    }
  },

  saveRoute: async (route: Route): Promise<void> => {
    try {
      if (route.id) {
        await api.put(`/rutas/favorita/${route.id}`, {
          esFavorita: route.isFavorite
        });
      } else {
        await api.post('/rutas/guardar', {
          userId: 2,
          origen: route.origin,
          destino: route.destination,
          fecha: route.date
        });
      }
    } catch (error) {
      console.error('Error guardando ruta:', error);
      throw error;
    }
  },

  deleteRoute: async (id: string): Promise<void> => {
    try {
      await api.delete(`/rutas/eliminar/${id}`);
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      throw error;
    }
  },

  clearHistory: async (): Promise<void> => {
    console.warn('clearHistory no soportado en backend por ahora');
  }
};