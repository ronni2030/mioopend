import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints/endpoints';
import type { ApiResponse } from '../../../shared/types/api.types';

// Tipos para usuarios
export interface Usuario {
  id: number;
  nameUsers: string;
  emailUser: string;
  userName: string;
  phoneUser: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUsuarioRequest {
  nameUsers: string;
  emailUser: string;
  userName: string;
  passwordUser: string;
  phoneUser: string;
}

export interface UpdateUsuarioRequest {
  nameUsers?: string;
  emailUser?: string;
  phoneUser?: string;
}

// Servicio de Usuarios - OpenBlind Cliente
export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const response = await apiClient.get<ApiResponse<Usuario[]>>(
      API_ENDPOINTS.usuarios.base
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await apiClient.get<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.obtener(id)
    );
    return response.data.data;
  },

  async create(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await apiClient.post<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    const response = await apiClient.put<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.usuarios.eliminar(id));
  },
};
