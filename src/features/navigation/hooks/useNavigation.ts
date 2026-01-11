/**
 * Hook principal de Navegación - OpenBlind
 * Integra: cálculo de ruta, navegación en tiempo real, GPS, voz
 */

import { useState, useEffect, useRef } from 'react';
import { navigationService, type RutaCalculada } from '../services/navigation.service';

interface PosicionGPS {
  latitud: number;
  longitud: number;
  precision: number;
  timestamp: number;
}

export const useNavigation = (idUsuario: number) => {
  const [ruta, setRuta] = useState<RutaCalculada | null>(null);
  const [rutasAlternativas, setRutasAlternativas] = useState<RutaCalculada[]>([]);
  const [posicionActual, setPosicionActual] = useState<PosicionGPS | null>(null);
  const [navegacionActiva, setNavegacionActiva] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasoActual, setPasoActual] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const speechEnabledRef = useRef(true);

  // Obtener posición GPS actual del usuario
  const obtenerPosicionActual = (): Promise<PosicionGPS> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalización no disponible'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos: PosicionGPS = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            precision: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setPosicionActual(pos);
          resolve(pos);
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Calcular ruta entre dos puntos
  const calcularRuta = async (
    origen: { latitud: number; longitud: number },
    destino: { latitud: number; longitud: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await navigationService.calcularRuta({
        idUsuario,
        origen,
        destino,
      });

      setRuta(resultado.ruta);
      hablarTexto(`Ruta calculada. Distancia: ${resultado.ruta.distancia.texto}. Tiempo estimado: ${resultado.ruta.duracion.texto}`);
      return resultado.ruta;
    } catch (err: any) {
      console.error('[useNavigation] Error calculando ruta:', err);
      setError(err.message || 'Error al calcular ruta');
      hablarTexto('Error al calcular la ruta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Calcular rutas alternativas
  const calcularAlternativas = async (
    origen: { latitud: number; longitud: number },
    destino: { latitud: number; longitud: number }
  ) => {
    setLoading(true);
    try {
      const rutas = await navigationService.calcularRutasAlternativas({
        idUsuario,
        origen,
        destino,
      });
      setRutasAlternativas(rutas);
      hablarTexto(`Se encontraron ${rutas.length} rutas alternativas`);
      return rutas;
    } catch (err: any) {
      console.error('[useNavigation] Error calculando alternativas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Iniciar navegación guiada por voz
  const iniciarNavegacion = async (
    origen: { latitud: number; longitud: number },
    destino: { latitud: number; longitud: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await navigationService.iniciarNavegacion({
        idUsuario,
        origen,
        destino,
      });

      setRuta(resultado.ruta);
      setNavegacionActiva(true);
      setPasoActual(0);

      // Iniciar seguimiento GPS en tiempo real
      iniciarSeguimientoGPS();

      // Leer primera instrucción
      if (resultado.ruta.pasos.length > 0) {
        hablarTexto(`Iniciando navegación. ${resultado.ruta.pasos[0].instruccion}`);
      }

      return true;
    } catch (err: any) {
      console.error('[useNavigation] Error iniciando navegación:', err);
      setError(err.message || 'Error al iniciar navegación');
      hablarTexto('Error al iniciar la navegación');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Iniciar seguimiento GPS en tiempo real
  const iniciarSeguimientoGPS = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalización no disponible');
      return;
    }

    // Detener seguimiento anterior si existe
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const nuevaPosicion: PosicionGPS = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precision: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setPosicionActual(nuevaPosicion);

        // Actualizar posición en el servidor
        if (navegacionActiva) {
          try {
            const estado = await navigationService.actualizarPosicion({
              idUsuario,
              latitud: nuevaPosicion.latitud,
              longitud: nuevaPosicion.longitud,
              precision: nuevaPosicion.precision,
            });

            // Si hay un nuevo paso, leerlo
            if (estado.siguientePaso) {
              hablarTexto(estado.siguientePaso.instruccion);
            }

            // Si hay alertas, notificarlas
            if (estado.alertas && estado.alertas.length > 0) {
              estado.alertas.forEach((alerta: any) => {
                hablarTexto(`Alerta: ${alerta.mensaje}`);
              });
            }
          } catch (err) {
            console.error('[useNavigation] Error actualizando posición:', err);
          }
        }
      },
      (err) => {
        console.error('[useNavigation] Error de GPS:', err);
        setError('Error obteniendo ubicación GPS');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Detener seguimiento GPS
  const detenerSeguimientoGPS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Recalcular ruta (cuando el usuario se desvía)
  const recalcularRuta = async () => {
    if (!posicionActual || !navegacionActiva) return;

    setLoading(true);
    try {
      const resultado = await navigationService.recalcularRuta({
        idUsuario,
        latitud: posicionActual.latitud,
        longitud: posicionActual.longitud,
      });

      setRuta(resultado.ruta);
      setPasoActual(0);
      hablarTexto('Ruta recalculada');
      return true;
    } catch (err: any) {
      console.error('[useNavigation] Error recalculando ruta:', err);
      hablarTexto('Error al recalcular la ruta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Finalizar navegación
  const finalizarNavegacion = async (completada: boolean = true) => {
    setLoading(true);
    try {
      await navigationService.finalizarNavegacion({
        idUsuario,
        completada,
      });

      detenerSeguimientoGPS();
      setNavegacionActiva(false);
      setRuta(null);
      setPasoActual(0);

      hablarTexto(completada ? 'Has llegado a tu destino' : 'Navegación cancelada');
      return true;
    } catch (err: any) {
      console.error('[useNavigation] Error finalizando navegación:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Leer instrucción actual por voz
  const leerInstruccionActual = () => {
    if (!ruta || !ruta.pasos[pasoActual]) return;
    const paso = ruta.pasos[pasoActual];
    hablarTexto(`${paso.instruccion}. En ${paso.distancia.texto}`);
  };

  // Leer resumen de la ruta
  const leerResumenRuta = () => {
    if (!ruta) {
      hablarTexto('No hay ruta calculada');
      return;
    }

    const texto = `Ruta de ${ruta.distancia.texto} con duración de ${ruta.duracion.texto}. ${ruta.pasos.length} pasos en total.`;
    hablarTexto(texto);
  };

  // Función auxiliar para síntesis de voz
  const hablarTexto = (texto: string) => {
    if (!speechEnabledRef.current) return;

    if ('speechSynthesis' in window) {
      // Cancelar cualquier speech anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Habilitar/deshabilitar voz
  const toggleVoz = (enabled: boolean) => {
    speechEnabledRef.current = enabled;
    if (!enabled) {
      window.speechSynthesis.cancel();
    }
  };

  // Limpiar seguimiento GPS al desmontar
  useEffect(() => {
    return () => {
      detenerSeguimientoGPS();
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    // Estado
    ruta,
    rutasAlternativas,
    posicionActual,
    navegacionActiva,
    loading,
    error,
    pasoActual,

    // Acciones
    obtenerPosicionActual,
    calcularRuta,
    calcularAlternativas,
    iniciarNavegacion,
    recalcularRuta,
    finalizarNavegacion,
    leerInstruccionActual,
    leerResumenRuta,
    toggleVoz,
    hablarTexto,
  };
};
