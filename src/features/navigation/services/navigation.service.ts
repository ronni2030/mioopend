/**
 * Servicio de Navegación - OpenBlind Cliente
 * Conecta con el backend en /api/navegacion
 */

import api from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../config/api.config';

export interface RutaCalculada {
  resumen: string;
  duracion: {
    valor: number; // segundos
    texto: string; // "20 min"
  };
  distancia: {
    valor: number; // metros
    texto: string; // "1.5 km"
  };
  inicio: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  fin: {
    direccion: string;
    latitud: number;
    longitud: number;
  };
  pasos: PasoRuta[];
  polyline?: string;
  geometria?: any;
  proveedor: string; // "openroute"
}

export interface PasoRuta {
  numero: number;
  instruccion: string;
  distancia: {
    valor: number;
    texto: string;
  };
  duracion: {
    valor: number;
    texto: string;
  };
  inicio: {
    latitud: number;
    longitud: number;
  };
  fin: {
    latitud: number;
    longitud: number;
  };
  maniobra: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const navigationService = {
  /**
   * Calcular ruta segura entre dos puntos
   */
  async calcularRuta(data: {
    idUsuario: number;
    origen: { latitud: number; longitud: number };
    destino: { latitud: number; longitud: number };
  }): Promise<{ ruta: RutaCalculada }> {
    const response = await api.post<ApiResponse<{ ruta: RutaCalculada }>>(
      API_ENDPOINTS.navegacion.calcularRuta,
      data
    );
    return response.data.data;
  },

  /**
   * Iniciar navegación en tiempo real
   */
  async iniciarNavegacion(data: {
    idUsuario: number;
    origen: { latitud: number; longitud: number };
    destino: { latitud: number; longitud: number };
  }): Promise<{
    sesionId: string;
    ruta: RutaCalculada;
    mensaje: string;
  }> {
    const response = await api.post<
      ApiResponse<{
        sesionId: string;
        ruta: RutaCalculada;
        mensaje: string;
      }>
    >(API_ENDPOINTS.navegacion.iniciar, data);
    return response.data.data;
  },

  /**
   * Actualizar posición durante navegación
   */
  async actualizarPosicion(data: {
    idUsuario: number;
    latitud: number;
    longitud: number;
    precision?: number;
  }): Promise<{
    enRuta: boolean;
    distanciaDestino: number;
    siguientePaso?: PasoRuta;
    alertas?: any[];
  }> {
    const response = await api.put<
      ApiResponse<{
        enRuta: boolean;
        distanciaDestino: number;
        siguientePaso?: PasoRuta;
        alertas?: any[];
      }>
    >(API_ENDPOINTS.navegacion.actualizarPosicion, data);
    return response.data.data;
  },

  /**
   * Recalcular ruta si el usuario se desvió
   */
  async recalcularRuta(data: {
    idUsuario: number;
    latitud: number;
    longitud: number;
  }): Promise<{ ruta: RutaCalculada; mensaje: string }> {
    const response = await api.post<
      ApiResponse<{ ruta: RutaCalculada; mensaje: string }>
    >(API_ENDPOINTS.navegacion.recalcular, data);
    return response.data.data;
  },

  /**
   * Finalizar navegación
   */
  async finalizarNavegacion(data: {
    idUsuario: number;
    completada?: boolean;
  }): Promise<{ mensaje: string; resumen: any }> {
    const response = await api.post<
      ApiResponse<{ mensaje: string; resumen: any }>
    >(API_ENDPOINTS.navegacion.finalizar, data);
    return response.data.data;
  },

  /**
   * Obtener estado actual de la navegación
   */
  async obtenerEstado(idUsuario: number): Promise<{
    activa: boolean;
    sesionId?: string;
    ruta?: RutaCalculada;
    posicionActual?: { latitud: number; longitud: number };
  }> {
    const response = await api.get<
      ApiResponse<{
        activa: boolean;
        sesionId?: string;
        ruta?: RutaCalculada;
        posicionActual?: { latitud: number; longitud: number };
      }>
    >(API_ENDPOINTS.navegacion.estado(idUsuario));
    return response.data.data;
  },

  /**
   * Calcular rutas alternativas
   */
  async calcularRutasAlternativas(data: {
    idUsuario?: number;
    origen: { latitud: number; longitud: number };
    destino: { latitud: number; longitud: number };
  }): Promise<RutaCalculada[]> {
    const response = await api.post<ApiResponse<RutaCalculada[]>>(
      API_ENDPOINTS.navegacion.rutasAlternativas,
      data
    );
    return response.data.data;
  },
};
