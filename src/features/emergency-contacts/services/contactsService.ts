/**
 * Servicio de Contactos de Emergencia - OpenBlind Cliente
 * Conecta con el backend en /api/contactos-emergencia
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';
import type { ContactoEmergencia } from '../types';

export interface ContactoEmergenciaBackend {
  idContactoEmergencia?: number;
  idUsuario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  parentesco: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const contactsService = {
  /**
   * Obtener contactos de emergencia de un usuario
   */
  async getByUsuario(idUsuario: number): Promise<ContactoEmergencia[]> {
    const response = await api.get<ApiResponse<ContactoEmergenciaBackend[]>>(
      API_ENDPOINTS.contactosEmergencia.porUsuario(idUsuario)
    );

    // Mapear del backend al formato del frontend
    return response.data.data.map(contacto => ({
      id: contacto.idContactoEmergencia?.toString() || '',
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco,
    }));
  },

  /**
   * Obtener un contacto por ID
   */
  async getById(id: number): Promise<ContactoEmergencia> {
    const response = await api.get<ApiResponse<ContactoEmergenciaBackend>>(
      API_ENDPOINTS.contactosEmergencia.porId(id)
    );

    const contacto = response.data.data;
    return {
      id: contacto.idContactoEmergencia?.toString() || '',
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco,
    };
  },

  /**
   * Crear nuevo contacto de emergencia
   */
  async create(data: Omit<ContactoEmergencia, 'id'> & { idUsuario: number }): Promise<ContactoEmergencia> {
    const payload: Partial<ContactoEmergenciaBackend> = {
      idUsuario: data.idUsuario,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      parentesco: data.parentesco,
    };

    const response = await api.post<ApiResponse<ContactoEmergenciaBackend>>(
      API_ENDPOINTS.contactosEmergencia.crear,
      payload
    );

    const contacto = response.data.data;
    return {
      id: contacto.idContactoEmergencia?.toString() || '',
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco,
    };
  },

  /**
   * Actualizar contacto existente
   */
  async update(
    id: number,
    data: Partial<Omit<ContactoEmergencia, 'id'>>
  ): Promise<ContactoEmergencia> {
    const payload: Partial<ContactoEmergenciaBackend> = {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      parentesco: data.parentesco,
    };

    const response = await api.put<ApiResponse<ContactoEmergenciaBackend>>(
      API_ENDPOINTS.contactosEmergencia.actualizar(id),
      payload
    );

    const contacto = response.data.data;
    return {
      id: contacto.idContactoEmergencia?.toString() || '',
      nombre: contacto.nombre,
      apellido: contacto.apellido,
      telefono: contacto.telefono,
      parentesco: contacto.parentesco,
    };
  },

  /**
   * Eliminar contacto (borrado físico)
   */
  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.contactosEmergencia.eliminar(id)
    );
  },
};
