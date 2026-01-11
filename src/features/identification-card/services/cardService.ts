import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';
import type { IdentificationCard } from '../types/card.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TarjetaMedicaBackend {
  idTarjetaMedica?: number;
  idUsuario: number;
  nombreCompleto: string;
  cedula: string;
  tipoSangre: string;
  alergias?: string;
  medicamentos?: string;
  condicionesMedicas?: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  activa: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const cardService = {
  /**
   * Obtener tarjeta médica por usuario
   */
  getCard: async (idUsuario: number): Promise<IdentificationCard | null> => {
    try {
      const response = await api.get<ApiResponse<TarjetaMedicaBackend>>(
        API_ENDPOINTS.tarjetaMedica.porUsuario(idUsuario)
      );

      const tarjeta = response.data.data;
      return {
        id: tarjeta.idTarjetaMedica || 0,
        nombreCompleto: tarjeta.nombreCompleto,
        cedula: tarjeta.cedula,
        tipoSangre: tarjeta.tipoSangre,
        alergias: tarjeta.alergias || '',
        medicamentos: tarjeta.medicamentos || '',
        condicionesMedicas: tarjeta.condicionesMedicas || '',
        contactoEmergencia: tarjeta.contactoEmergencia,
        telefonoEmergencia: tarjeta.telefonoEmergencia,
      };
    } catch (error) {
      console.error('Error obteniendo tarjeta médica:', error);
      return null;
    }
  },

  /**
   * Crear o actualizar tarjeta médica
   */
  saveCard: async (card: IdentificationCard, idUsuario: number): Promise<void> => {
    try {
      const payload: Partial<TarjetaMedicaBackend> = {
        idUsuario,
        nombreCompleto: card.nombreCompleto,
        cedula: card.cedula,
        tipoSangre: card.tipoSangre,
        alergias: card.alergias || undefined,
        medicamentos: card.medicamentos || undefined,
        condicionesMedicas: card.condicionesMedicas || undefined,
        contactoEmergencia: card.contactoEmergencia,
        telefonoEmergencia: card.telefonoEmergencia,
      };

      if (card.id && card.id > 0) {
        // Actualizar tarjeta existente
        await api.put<ApiResponse<TarjetaMedicaBackend>>(
          API_ENDPOINTS.tarjetaMedica.actualizar(card.id),
          payload
        );
      } else {
        // Crear nueva tarjeta
        await api.post<ApiResponse<TarjetaMedicaBackend>>(
          API_ENDPOINTS.tarjetaMedica.crear,
          payload
        );
      }
    } catch (error) {
      console.error('Error guardando tarjeta médica:', error);
      throw error;
    }
  },

  /**
   * Desactivar tarjeta médica
   */
  revokeCard: async (id: number): Promise<void> => {
    try {
      await api.put<ApiResponse<void>>(
        API_ENDPOINTS.tarjetaMedica.desactivar(id)
      );
    } catch (error) {
      console.error('Error desactivando tarjeta médica:', error);
      throw error;
    }
  }
};
