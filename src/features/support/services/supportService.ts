/**
 * Servicio de Soporte (Tickets) - OpenBlind Cliente
 * Conecta con el backend en /api/admin/soporte
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

export interface TicketSoporte {
  idTicket?: number;
  idUsuario: number;
  asunto: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  respuesta?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const supportService = {
  /**
   * Obtener tickets de un usuario
   */
  async getByUsuario(idUsuario: number): Promise<TicketSoporte[]> {
    const response = await api.get<ApiResponse<TicketSoporte[]>>(
      API_ENDPOINTS.soporte.porUsuario(idUsuario)
    );
    return response.data.data;
  },

  /**
   * Obtener un ticket por ID
   */
  async getById(id: number): Promise<TicketSoporte> {
    const response = await api.get<ApiResponse<TicketSoporte>>(
      API_ENDPOINTS.soporte.obtener(id)
    );
    return response.data.data;
  },

  /**
   * Crear nuevo ticket de soporte
   */
  async create(data: {
    idUsuario: number;
    asunto: string;
    descripcion: string;
    prioridad?: 'baja' | 'media' | 'alta';
  }): Promise<TicketSoporte> {
    const payload = {
      idUsuario: data.idUsuario,
      asunto: data.asunto,
      descripcion: data.descripcion,
      prioridad: data.prioridad || 'media',
      estado: 'abierto' as const,
    };

    const response = await api.post<ApiResponse<TicketSoporte>>(
      API_ENDPOINTS.soporte.crear,
      payload
    );
    return response.data.data;
  },

  /**
   * Actualizar ticket (agregar más detalles)
   */
  async update(
    id: number,
    data: {
      descripcion?: string;
      asunto?: string;
    }
  ): Promise<TicketSoporte> {
    const response = await api.put<ApiResponse<TicketSoporte>>(
      API_ENDPOINTS.soporte.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Archivar ticket (borrado lógico)
   */
  async archive(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.soporte.obtener(id)
    );
  },
};
