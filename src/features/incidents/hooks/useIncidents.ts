/**
 * Hook para gestionar incidencias (reportes de obstáculos, obras, etc.)
 */

import { useState, useEffect } from 'react';
import { incidentsService, type Incidencia } from '../services/incidentsService';

export const useIncidents = (idUsuario?: number) => {
  const [incidents, setIncidents] = useState<Incidencia[]>([]);
  const [nearbyIncidents, setNearbyIncidents] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar incidencias del usuario
  const loadIncidents = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentsService.getByUsuario(userId);
      setIncidents(data);
    } catch (err) {
      console.error('[useIncidents] Error loading incidents:', err);
      setError('Error al cargar incidencias');
    } finally {
      setLoading(false);
    }
  };

  // Cargar incidencias cercanas a una ubicación
  const loadNearbyIncidents = async (
    latitud: number,
    longitud: number,
    radio: number = 1000
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentsService.getNearby(latitud, longitud, radio);
      setNearbyIncidents(data);
      return data;
    } catch (err) {
      console.error('[useIncidents] Error loading nearby incidents:', err);
      setError('Error al cargar incidencias cercanas');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente si se proporciona idUsuario
  useEffect(() => {
    if (idUsuario) {
      loadIncidents(idUsuario);
    }
  }, [idUsuario]);

  // Crear nueva incidencia
  const createIncident = async (data: {
    tipo: 'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro';
    descripcion: string;
    latitud: number;
    longitud: number;
  }): Promise<boolean> => {
    if (!idUsuario) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const newIncident = await incidentsService.create({
        idUsuario,
        ...data,
      });

      setIncidents((prev) => [newIncident, ...prev]);

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Incidencia reportada correctamente');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useIncidents] Error creating incident:', err);
      setError('Error al crear incidencia');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar incidencia
  const updateIncident = async (
    id: number,
    data: {
      descripcion?: string;
      tipo?: 'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro';
    }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await incidentsService.update(id, data);

      setIncidents((prev) =>
        prev.map((inc) => (inc.idIncidencia === id ? updated : inc))
      );

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Incidencia actualizada');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useIncidents] Error updating incident:', err);
      setError('Error al actualizar incidencia');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar incidencia
  const closeIncident = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await incidentsService.close(id);

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.idIncidencia === id ? { ...inc, estado: 'resuelto' } : inc
        )
      );

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Incidencia cerrada');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useIncidents] Error closing incident:', err);
      setError('Error al cerrar incidencia');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar incidencia
  const deleteIncident = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await incidentsService.delete(id);

      setIncidents((prev) => prev.filter((inc) => inc.idIncidencia !== id));

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Incidencia eliminada');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useIncidents] Error deleting incident:', err);
      setError('Error al eliminar incidencia');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Leer incidencias por voz
  const readIncidents = () => {
    if ('speechSynthesis' in window) {
      if (incidents.length === 0) {
        const utterance = new SpeechSynthesisUtterance('No tienes incidencias reportadas');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
        return;
      }

      incidents.forEach((inc) => {
        const texto = `Tipo: ${inc.tipo}. ${inc.descripcion}. Estado: ${inc.estado}`;
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  return {
    incidents,
    nearbyIncidents,
    loading,
    error,
    loadIncidents,
    loadNearbyIncidents,
    createIncident,
    updateIncident,
    closeIncident,
    deleteIncident,
    readIncidents,
  };
};
