/**
 * Servicio de Incidencias - OpenBlind Cliente
 * Conecta con el backend en /api/incidencias
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

export interface Incidencia {
  idIncidencia?: number;
  idUsuario: number;
  tipo: 'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro';
  descripcion: string;
  latitud: number;
  longitud: number;
  estado: 'abierto' | 'en_revision' | 'resuelto' | 'descartado';
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const incidentsService = {
  /**
   * Obtener incidencias de un usuario
   */
  async getByUsuario(idUsuario: number): Promise<Incidencia[]> {
    const response = await api.get<ApiResponse<Incidencia[]>>(
      API_ENDPOINTS.incidencias.porUsuario(idUsuario)
    );
    return response.data.data;
  },

  /**
   * Obtener incidencias cercanas a una ubicación
   */
  async getNearby(
    latitud: number,
    longitud: number,
    radio: number = 1000
  ): Promise<Incidencia[]> {
    const response = await api.get<ApiResponse<Incidencia[]>>(
      API_ENDPOINTS.incidencias.cercanas,
      {
        params: { latitud, longitud, radio },
      }
    );
    return response.data.data;
  },

  /**
   * Crear nueva incidencia
   */
  async create(data: {
    idUsuario: number;
    tipo: 'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro';
    descripcion: string;
    latitud: number;
    longitud: number;
  }): Promise<Incidencia> {
    const payload = {
      ...data,
      estado: 'abierto' as const,
    };

    const response = await api.post<ApiResponse<Incidencia>>(
      API_ENDPOINTS.incidencias.crear,
      payload
    );
    return response.data.data;
  },

  /**
   * Actualizar incidencia (editar descripción mientras está abierta)
   */
  async update(
    id: number,
    data: {
      descripcion?: string;
      tipo?: 'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro';
    }
  ): Promise<Incidencia> {
    const response = await api.put<ApiResponse<Incidencia>>(
      API_ENDPOINTS.incidencias.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Cerrar incidencia
   */
  async close(id: number): Promise<void> {
    await api.put<ApiResponse<void>>(
      API_ENDPOINTS.incidencias.cerrar(id),
      { estado: 'resuelto' }
    );
  },

  /**
   * Eliminar incidencia (si fue un error)
   */
  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.incidencias.eliminar(id)
    );
  },
};
