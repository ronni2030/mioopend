/**
 * Configuración de la API - OpenBlind Cliente
 *
 * IMPORTANTE: No usar archivos .env por problemas con VPS
 * Toda la configuración va directamente aquí
 */

export const API_CONFIG = {
  // URL base del backend
  BASE_URL: 'http://localhost:8888',

  // Timeout para requests (30 segundos)
  TIMEOUT: 30000,

  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
  },

  // Configuración de retry
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Endpoints de la API (coinciden con el backend REAL)
export const API_ENDPOINTS = {
  // Usuarios
  usuarios: {
    base: '/api/usuarios',
    obtener: (id: number) => `/api/usuarios/${id}`,
    crear: '/api/usuarios',
    actualizar: (id: number) => `/api/usuarios/${id}`,
    eliminar: (id: number) => `/api/usuarios/${id}`,
  },

  // Preferencias de Usuario
  preferencias: {
    base: '/api/preferencias',
    porUsuario: (idUsuario: number) => `/api/preferencias/usuario/${idUsuario}`,
    crear: '/api/preferencias',
    actualizar: (id: number) => `/api/preferencias/${id}`,
    resetear: (id: number) => `/api/preferencias/${id}/resetear`,
  },

  // Lugares Favoritos - Rutas REALES del backend
  lugaresFavoritos: {
    base: '/lugares-favoritos',
    porUsuario: (idUsuario: number) => `/lugares-favoritos/cliente/${idUsuario}`,
    porId: (id: number) => `/lugares-favoritos/lugar/${id}`,
    crear: '/lugares-favoritos/crear',
    actualizar: (id: number) => `/lugares-favoritos/actualizar/${id}`,
    eliminar: (id: number) => `/lugares-favoritos/eliminar/${id}`,
    cercanos: '/lugares-favoritos/cercanos',
  },

  // Contactos de Emergencia - Rutas REALES del backend
  contactosEmergencia: {
    base: '/contactos-emergencia',
    porUsuario: (idUsuario: number) => `/contactos-emergencia/cliente/${idUsuario}`,
    porId: (id: number) => `/contactos-emergencia/${id}`,
    crear: '/contactos-emergencia',
    actualizar: (id: number) => `/contactos-emergencia/${id}`,
    eliminar: (id: number) => `/contactos-emergencia/${id}`,
  },

  // Navegación (Guía de Voz)
  navegacion: {
    calcularRuta: '/api/navegacion/calcular-ruta',
    iniciar: '/api/navegacion/iniciar',
    actualizarPosicion: '/api/navegacion/actualizar-posicion',
    recalcular: '/api/navegacion/recalcular',
    finalizar: '/api/navegacion/finalizar',
    estado: (idUsuario: number) => `/api/navegacion/estado/${idUsuario}`,
    rutasAlternativas: '/api/navegacion/rutas-alternativas',
  },

  // Tarjeta Médica/Identificación - Rutas REALES del backend
  tarjetaMedica: {
    base: '/tarjeta',
    porUsuario: (idUsuario: number) => `/tarjeta/cliente/${idUsuario}`,
    crear: '/tarjeta/crear',
    actualizar: (id: number) => `/tarjeta/actualizar/${id}`,
    desactivar: (id: number) => `/tarjeta/desactivar/${id}`,
  },

  // Historial de Rutas - Rutas REALES del backend
  historialRutas: {
    base: '/rutas',
    porUsuario: (idUsuario: number) => `/rutas/historial/${idUsuario}`,
    crear: '/rutas/guardar',
    marcarFavorita: (id: number) => `/rutas/favorita/${id}`,
    eliminar: (id: number) => `/rutas/eliminar/${id}`,
    limpiar: (idUsuario: number) => `/rutas/limpiar/${idUsuario}`,
  },

  // Incidencias (Reportes)
  incidencias: {
    base: '/api/incidencias',
    porUsuario: (idUsuario: number) => `/api/incidencias/usuario/${idUsuario}`,
    cercanas: '/api/incidencias/cercanas',
    crear: '/api/incidencias',
    actualizar: (id: number) => `/api/incidencias/${id}`,
    cerrar: (id: number) => `/api/incidencias/${id}/cerrar`,
    eliminar: (id: number) => `/api/incidencias/${id}`,
  },

  // Soporte (Tickets)
  soporte: {
    base: '/api/admin/soporte',
    porUsuario: (idUsuario: number) => `/api/admin/soporte/usuario/${idUsuario}`,
    crear: '/api/admin/soporte',
    actualizar: (id: number) => `/api/admin/soporte/${id}`,
    obtener: (id: number) => `/api/admin/soporte/${id}`,
  },

  // Tracking de Ubicación
  tracking: {
    base: '/api/tracking',
    iniciar: '/api/tracking/iniciar',
    actualizar: '/api/tracking/actualizar',
    detener: '/api/tracking/detener',
    historial: (idUsuario: number) => `/api/tracking/historial/${idUsuario}`,
  },
} as const;
