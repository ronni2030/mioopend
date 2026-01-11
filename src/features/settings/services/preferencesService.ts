/**
 * Servicio de Preferencias de Usuario - OpenBlind Cliente
 * Conecta con el backend en /api/preferencias
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

export interface PreferenciasUsuario {
  idPreferencias?: number;
  idUsuario: number;
  idIdioma: number;
  velocidadVoz: number; // 0.5 a 2.0
  volumenVoz: number; // 0 a 100
  feedbackHaptico: boolean;
  nivelDetalleInstrucciones: 'basico' | 'medio' | 'detallado';
  modoAltoContraste: boolean;
  tamanoFuente: 'pequeno' | 'mediano' | 'grande' | 'extra_grande';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const preferencesService = {
  /**
   * Obtener preferencias de un usuario
   */
  async getByUsuario(idUsuario: number): Promise<PreferenciasUsuario> {
    const response = await api.get<ApiResponse<PreferenciasUsuario>>(
      API_ENDPOINTS.preferencias.porUsuario(idUsuario)
    );
    return response.data.data;
  },

  /**
   * Crear preferencias iniciales al registrarse
   */
  async create(data: {
    idUsuario: number;
    idIdioma?: number;
    velocidadVoz?: number;
    volumenVoz?: number;
    feedbackHaptico?: boolean;
    nivelDetalleInstrucciones?: 'basico' | 'medio' | 'detallado';
    modoAltoContraste?: boolean;
    tamanoFuente?: 'pequeno' | 'mediano' | 'grande' | 'extra_grande';
  }): Promise<PreferenciasUsuario> {
    const payload = {
      idUsuario: data.idUsuario,
      idIdioma: data.idIdioma || 1, // Español por defecto
      velocidadVoz: data.velocidadVoz || 1.0,
      volumenVoz: data.volumenVoz || 80,
      feedbackHaptico: data.feedbackHaptico !== undefined ? data.feedbackHaptico : true,
      nivelDetalleInstrucciones: data.nivelDetalleInstrucciones || 'medio',
      modoAltoContraste: data.modoAltoContraste || false,
      tamanoFuente: data.tamanoFuente || 'mediano',
    };

    const response = await api.post<ApiResponse<PreferenciasUsuario>>(
      API_ENDPOINTS.preferencias.crear,
      payload
    );
    return response.data.data;
  },

  /**
   * Actualizar preferencias
   */
  async update(
    id: number,
    data: Partial<Omit<PreferenciasUsuario, 'idPreferencias' | 'idUsuario' | 'createdAt' | 'updatedAt'>>
  ): Promise<PreferenciasUsuario> {
    const response = await api.put<ApiResponse<PreferenciasUsuario>>(
      API_ENDPOINTS.preferencias.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Resetear preferencias a valores por defecto
   */
  async reset(id: number): Promise<PreferenciasUsuario> {
    const response = await api.post<ApiResponse<PreferenciasUsuario>>(
      API_ENDPOINTS.preferencias.resetear(id)
    );
    return response.data.data;
  },
};
