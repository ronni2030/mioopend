import api from '../../../services/api/client';
import type { Place, PlaceFormData, PlacesListResponse, PlaceType } from '../types/place.types';

export const placesService = {
  async getPlaces(page = 1, limit = 10, filters?: { search?: string; type?: string }): Promise<PlacesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.type && { type: filters.type }),
    });

    try {
      const response = await api.get<{
        success: boolean;
        data: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/places?${params}`);
      
      const mappedResponse: PlacesListResponse = {
        places: response.data.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          address: item.address || '',
          description: item.description || '',
          type: decodeURIComponent(item.type || '') as PlaceType,
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          userId: '',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        pagination: response.data.pagination,
      };
      
      return mappedResponse;
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

  async getPlaceById(id: string): Promise<Place> {
    const response = await api.get<Place>(`/places/${id}`);
    return response.data;
  },

  async createPlace(data: PlaceFormData): Promise<Place> {
    const response = await api.post<Place>('/places', data);
    return response.data;
  },

  async updatePlace(id: string, data: Partial<PlaceFormData>): Promise<Place> {
    const response = await api.put<Place>(`/places/${id}`, data);
    return response.data;
  },

  async deletePlace(id: string): Promise<void> {
    await api.delete(`/places/${id}`);
  },

  async getPlacesByType(type: string): Promise<Place[]> {
    const response = await api.get<Place[]>(`/places/type/${type}`);
    return response.data;
  },

  async getNearbyPlaces(latitude: number, longitude: number, radius = 1000): Promise<Place[]> {
    const response = await api.get<Place[]>(`/places/nearby`, {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },
};