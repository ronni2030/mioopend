/**
 * Hook para gestionar preferencias de usuario
 */

import { useState, useEffect } from 'react';
import { preferencesService, type PreferenciasUsuario } from '../services/preferencesService';

export const usePreferences = (idUsuario?: number) => {
  const [preferences, setPreferences] = useState<PreferenciasUsuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar preferencias del usuario
  const loadPreferences = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await preferencesService.getByUsuario(userId);
      setPreferences(data);
      return data;
    } catch (err) {
      console.error('[usePreferences] Error loading preferences:', err);
      setError('Error al cargar preferencias');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente si se proporciona idUsuario
  useEffect(() => {
    if (idUsuario) {
      loadPreferences(idUsuario);
    }
  }, [idUsuario]);

  // Crear preferencias iniciales
  const createPreferences = async (data: {
    idIdioma?: number;
    velocidadVoz?: number;
    volumenVoz?: number;
    feedbackHaptico?: boolean;
    nivelDetalleInstrucciones?: 'basico' | 'medio' | 'detallado';
    modoAltoContraste?: boolean;
    tamanoFuente?: 'pequeno' | 'mediano' | 'grande' | 'extra_grande';
  }): Promise<boolean> => {
    if (!idUsuario) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const newPrefs = await preferencesService.create({
        idUsuario,
        ...data,
      });

      setPreferences(newPrefs);

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Preferencias creadas correctamente');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[usePreferences] Error creating preferences:', err);
      setError('Error al crear preferencias');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar preferencias
  const updatePreferences = async (
    data: Partial<Omit<PreferenciasUsuario, 'idPreferencias' | 'idUsuario' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    if (!preferences?.idPreferencias) {
      setError('No hay preferencias cargadas');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await preferencesService.update(preferences.idPreferencias, data);

      setPreferences(updated);

      // Aplicar configuración de voz inmediatamente si cambió
      if (data.velocidadVoz !== undefined || data.volumenVoz !== undefined) {
        applyVoiceSettings(updated);
      }

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Preferencias actualizadas');
        utterance.lang = 'es-ES';
        utterance.rate = updated.velocidadVoz;
        utterance.volume = updated.volumenVoz / 100;
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[usePreferences] Error updating preferences:', err);
      setError('Error al actualizar preferencias');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resetear preferencias a valores por defecto
  const resetPreferences = async (): Promise<boolean> => {
    if (!preferences?.idPreferencias) {
      setError('No hay preferencias cargadas');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const reset = await preferencesService.reset(preferences.idPreferencias);

      setPreferences(reset);

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          'Preferencias restablecidas a valores por defecto'
        );
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[usePreferences] Error resetting preferences:', err);
      setError('Error al resetear preferencias');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Aplicar configuración de voz globalmente
  const applyVoiceSettings = (prefs: PreferenciasUsuario) => {
    // Guardar en localStorage para uso en toda la app
    localStorage.setItem('voiceRate', prefs.velocidadVoz.toString());
    localStorage.setItem('voiceVolume', (prefs.volumenVoz / 100).toString());
  };

  // Leer preferencias actuales por voz
  const readPreferences = () => {
    if (!preferences) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('No hay preferencias configuradas');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    if ('speechSynthesis' in window) {
      const texto = `
        Velocidad de voz: ${preferences.velocidadVoz}.
        Volumen: ${preferences.volumenVoz} por ciento.
        Feedback háptico: ${preferences.feedbackHaptico ? 'activado' : 'desactivado'}.
        Nivel de detalle: ${preferences.nivelDetalleInstrucciones}.
        Alto contraste: ${preferences.modoAltoContraste ? 'activado' : 'desactivado'}.
        Tamaño de fuente: ${preferences.tamanoFuente}.
      `;

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      utterance.rate = preferences.velocidadVoz;
      utterance.volume = preferences.volumenVoz / 100;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Aplicar preferencias al cargar
  useEffect(() => {
    if (preferences) {
      applyVoiceSettings(preferences);
    }
  }, [preferences]);

  return {
    preferences,
    loading,
    error,
    loadPreferences,
    createPreferences,
    updatePreferences,
    resetPreferences,
    readPreferences,
  };
};
