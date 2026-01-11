/**
 * Servicio de Lugares Favoritos - OpenBlind Cliente
 * Conecta con el backend en /api/lugares-favoritos
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';
import type { Place, PlaceFormData, PlacesListResponse, PlaceType } from '../types/place.types';

export interface LugarFavoritoBackend {
  idLugarFavorito?: number;
  idUsuario: number;
  nombre: string;
  direccion: string;
  descripcion?: string;
  tipo: 'parada_segura' | 'destino_frecuente' | 'casa' | 'trabajo' | 'otro';
  latitud: number;
  longitud: number;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const placesService = {
  /**
   * Obtener lugares favoritos de un usuario
   */
  async getByUsuario(idUsuario: number): Promise<Place[]> {
    const response = await api.get<ApiResponse<LugarFavoritoBackend[]>>(
      API_ENDPOINTS.lugaresFavoritos.porUsuario(idUsuario)
    );

    return response.data.data.map(lugar => ({
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    }));
  },

  /**
   * Obtener lugares con paginación
   */
  async getPlaces(
    page = 1,
    limit = 10,
    filters?: { search?: string; type?: string; userId?: number }
  ): Promise<PlacesListResponse> {
    try {
      // Si hay userId en filters, usar el endpoint por usuario
      if (filters?.userId) {
        const places = await this.getByUsuario(filters.userId);

        // Filtrar por búsqueda y tipo si es necesario
        let filteredPlaces = places;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPlaces = places.filter(
            p =>
              p.name.toLowerCase().includes(searchLower) ||
              p.address.toLowerCase().includes(searchLower)
          );
        }
        if (filters.type) {
          filteredPlaces = filteredPlaces.filter(p => p.type === filters.type);
        }

        // Paginar manualmente
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedPlaces = filteredPlaces.slice(start, end);

        return {
          places: paginatedPlaces,
          pagination: {
            page,
            limit,
            total: filteredPlaces.length,
            totalPages: Math.ceil(filteredPlaces.length / limit),
          },
        };
      }

      // Si no hay userId, obtener todos (para admin)
      const response = await api.get<ApiResponse<LugarFavoritoBackend[]>>(
        API_ENDPOINTS.lugaresFavoritos.base
      );

      const allPlaces = response.data.data.map(lugar => ({
        id: lugar.idLugarFavorito?.toString() || '',
        name: lugar.nombre,
        address: lugar.direccion,
        description: lugar.descripcion || '',
        type: lugar.tipo as PlaceType,
        latitude: lugar.latitud,
        longitude: lugar.longitud,
        userId: lugar.idUsuario.toString(),
        createdAt: lugar.createdAt,
        updatedAt: lugar.updatedAt,
      }));

      return {
        places: allPlaces,
        pagination: {
          page: 1,
          limit: allPlaces.length,
          total: allPlaces.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error('Error fetching places:', error);
      return {
        places: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };
    }
  },

  /**
   * Obtener un lugar por ID
   */
  async getPlaceById(id: string): Promise<Place> {
    const response = await api.get<ApiResponse<LugarFavoritoBackend>>(
      API_ENDPOINTS.lugaresFavoritos.porId(parseInt(id))
    );

    const lugar = response.data.data;
    return {
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    };
  },

  /**
   * Crear nuevo lugar favorito
   */
  async createPlace(data: PlaceFormData & { userId: string }): Promise<Place> {
    const payload: Partial<LugarFavoritoBackend> = {
      idUsuario: parseInt(data.userId),
      nombre: data.name,
      direccion: data.address,
      descripcion: data.description,
      tipo: data.type as LugarFavoritoBackend['tipo'],
      latitud: data.latitude,
      longitud: data.longitude,
    };

    const response = await api.post<ApiResponse<LugarFavoritoBackend>>(
      API_ENDPOINTS.lugaresFavoritos.crear,
      payload
    );

    const lugar = response.data.data;
    return {
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    };
  },

  /**
   * Actualizar lugar favorito
   */
  async updatePlace(id: string, data: Partial<PlaceFormData>): Promise<Place> {
    const payload: Partial<LugarFavoritoBackend> = {};

    if (data.name) payload.nombre = data.name;
    if (data.address) payload.direccion = data.address;
    if (data.description !== undefined) payload.descripcion = data.description;
    if (data.type) payload.tipo = data.type as LugarFavoritoBackend['tipo'];
    if (data.latitude !== undefined) payload.latitud = data.latitude;
    if (data.longitude !== undefined) payload.longitud = data.longitude;

    const response = await api.put<ApiResponse<LugarFavoritoBackend>>(
      API_ENDPOINTS.lugaresFavoritos.actualizar(parseInt(id)),
      payload
    );

    const lugar = response.data.data;
    return {
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    };
  },

  /**
   * Eliminar lugar favorito (borrado físico)
   */
  async deletePlace(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.lugaresFavoritos.eliminar(parseInt(id))
    );
  },

  /**
   * Obtener lugares por tipo
   */
  async getPlacesByType(type: string, userId?: number): Promise<Place[]> {
    if (userId) {
      const places = await this.getByUsuario(userId);
      return places.filter(p => p.type === type);
    }

    const response = await api.get<ApiResponse<LugarFavoritoBackend[]>>(
      API_ENDPOINTS.lugaresFavoritos.base,
      { params: { tipo: type } }
    );

    return response.data.data.map(lugar => ({
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    }));
  },

  /**
   * Obtener lugares cercanos
   */
  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius = 1000
  ): Promise<Place[]> {
    const response = await api.get<ApiResponse<LugarFavoritoBackend[]>>(
      API_ENDPOINTS.lugaresFavoritos.cercanos,
      {
        params: { latitud: latitude, longitud: longitude, radio: radius },
      }
    );

    return response.data.data.map(lugar => ({
      id: lugar.idLugarFavorito?.toString() || '',
      name: lugar.nombre,
      address: lugar.direccion,
      description: lugar.descripcion || '',
      type: lugar.tipo as PlaceType,
      latitude: lugar.latitud,
      longitude: lugar.longitud,
      userId: lugar.idUsuario.toString(),
      createdAt: lugar.createdAt,
      updatedAt: lugar.updatedAt,
    }));
  },
};
