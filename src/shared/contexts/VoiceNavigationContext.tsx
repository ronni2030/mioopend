/**
 * Contexto global para navegación por voz
 * Permite controlar toda la app sin tocar la pantalla
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface VoiceNavigationContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, priority?: 'high' | 'normal') => void;
  announceCurrentPage: () => void;
  enableVoiceControl: boolean;
  setEnableVoiceControl: (enabled: boolean) => void;
}

const VoiceNavigationContext = createContext<VoiceNavigationContextType | undefined>(undefined);

export const useVoiceNavigation = () => {
  const context = useContext(VoiceNavigationContext);
  if (!context) {
    throw new Error('useVoiceNavigation debe usarse dentro de VoiceNavigationProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const VoiceNavigationProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isListening, startListening, stopListening, registerCommands } = useSpeechRecognition();
  const {
    speak,
    stop,
    welcome,
    announcePage,
    readMenu,
    help,
    isAvailable,
  } = useVoiceAssistant();

  const [enableVoiceControl, setEnableVoiceControl] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Mapeo de rutas a nombres de página
  const getPageInfo = (path: string) => {
    const routes: Record<string, { name: string; options: string[] }> = {
      '/': {
        name: 'página principal',
        options: ['navegación', 'mi ubicación', 'lugares', 'emergencia', 'incidencias', 'soporte', 'historial', 'mi tarjeta', 'perfil', 'ajustes'],
      },
      '/navigation': {
        name: 'navegación',
        options: ['buscar destino', 'calcular ruta', 'iniciar navegación', 'volver'],
      },
      '/location': {
        name: 'mi ubicación',
        options: ['ver mapa', 'actualizar ubicación', 'calcular ruta', 'volver'],
      },
      '/places': {
        name: 'lugares favoritos',
        options: ['ver lista', 'agregar nuevo lugar', 'editar lugar', 'volver'],
      },
      '/emergency-contacts': {
        name: 'contactos de emergencia',
        options: ['ver contactos', 'agregar contacto', 'llamar contacto', 'volver'],
      },
      '/incidents': {
        name: 'reportar incidencia',
        options: ['reportar obstáculo', 'reportar obra', 'reportar zona peligrosa', 'ver mis reportes', 'volver'],
      },
      '/support': {
        name: 'soporte',
        options: ['crear ticket', 'ver mis tickets', 'volver'],
      },
      '/settings': {
        name: 'configuración',
        options: ['velocidad de voz', 'volumen', 'modo visual', 'probar voz', 'volver'],
      },
      '/profile': {
        name: 'mi perfil',
        options: ['ver información', 'editar perfil', 'ir a configuración', 'volver'],
      },
      '/history': {
        name: 'historial de navegación',
        options: ['ver todas las rutas', 'filtrar por completadas', 'filtrar por canceladas', 'limpiar historial', 'volver'],
      },
      '/id-card': {
        name: 'tarjeta de identificación',
        options: ['leer información', 'editar tarjeta', 'ver más detalles', 'volver'],
      },
    };

    return routes[path] || { name: 'página desconocida', options: [] };
  };

  // Anunciar página actual
  const announceCurrentPage = () => {
    const pageInfo = getPageInfo(location.pathname);
    announcePage(pageInfo.name, pageInfo.options);
  };

  // Registrar comandos globales de navegación
  useEffect(() => {
    if (!enableVoiceControl || !isAvailable) return;

    const commands = [
      {
        name: 'Ir a inicio',
        keywords: ['inicio', 'home', 'principal', 'volver inicio'],
        action: () => {
          speak('Navegando a inicio', 'high');
          navigate('/');
        },
      },
      {
        name: 'Ir a navegación',
        keywords: ['navegación', 'navegar', 'ir navegación', 'calcular ruta'],
        action: () => {
          speak('Navegando a navegación', 'high');
          navigate('/navigation');
        },
      },
      {
        name: 'Ir a lugares favoritos',
        keywords: ['lugares', 'favoritos', 'lugares favoritos', 'mis lugares'],
        action: () => {
          speak('Navegando a lugares favoritos', 'high');
          navigate('/places');
        },
      },
      {
        name: 'Ir a contactos de emergencia',
        keywords: ['contactos', 'emergencia', 'contactos emergencia', 'mis contactos'],
        action: () => {
          speak('Navegando a contactos de emergencia', 'high');
          navigate('/emergency-contacts');
        },
      },
      {
        name: 'Reportar incidencia',
        keywords: ['incidencia', 'reportar', 'obstáculo', 'obra', 'peligro'],
        action: () => {
          speak('Navegando a reportar incidencia', 'high');
          navigate('/incidents');
        },
      },
      {
        name: 'Ir a soporte',
        keywords: ['soporte', 'ayuda técnica', 'ticket', 'problema'],
        action: () => {
          speak('Navegando a soporte', 'high');
          navigate('/support');
        },
      },
      {
        name: 'Ir a configuración',
        keywords: ['configuración', 'ajustes', 'preferencias', 'settings'],
        action: () => {
          speak('Navegando a configuración', 'high');
          navigate('/settings');
        },
      },
      {
        name: 'Volver atrás',
        keywords: ['atrás', 'volver', 'regresar', 'anterior'],
        action: () => {
          speak('Volviendo atrás', 'high');
          navigate(-1);
        },
      },
      {
        name: 'Menú principal',
        keywords: ['menú', 'opciones', 'qué puedo hacer', 'mostrar menú'],
        action: () => {
          const menuItems = [
            { name: 'navegación', description: 'calcular rutas accesibles' },
            { name: 'lugares favoritos', description: 'guardar lugares frecuentes' },
            { name: 'contactos de emergencia', description: 'gestionar contactos' },
            { name: 'reportar incidencia', description: 'reportar obstáculos' },
            { name: 'soporte', description: 'obtener ayuda técnica' },
            { name: 'configuración', description: 'ajustar preferencias' },
          ];
          readMenu(menuItems);
        },
      },
      {
        name: 'Repetir',
        keywords: ['repetir', 'otra vez', 'de nuevo', 'qué dijiste'],
        action: () => {
          announceCurrentPage();
        },
      },
      {
        name: 'Ayuda',
        keywords: ['ayuda', 'cómo funciona', 'instrucciones', 'comandos'],
        action: () => {
          help();
        },
      },
      {
        name: 'Detener voz',
        keywords: ['detener', 'callate', 'silencio', 'parar', 'stop'],
        action: () => {
          stop();
        },
      },
    ];

    registerCommands(commands);
  }, [enableVoiceControl, isAvailable, navigate, location.pathname]);

  // Dar bienvenida al cargar la app (solo una vez)
  // NOTA: Esperamos a la primera interacción del usuario para evitar bloqueo de autoplay
  useEffect(() => {
    if (!hasWelcomed && isAvailable && enableVoiceControl) {
      const handleFirstInteraction = () => {
        setTimeout(() => {
          welcome();
          setHasWelcomed(true);
        }, 100);
      };

      // Escuchar primera interacción (clic, tecla, o touch)
      document.addEventListener('click', handleFirstInteraction, { once: true });
      document.addEventListener('keydown', handleFirstInteraction, { once: true });
      document.addEventListener('touchstart', handleFirstInteraction, { once: true });

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [hasWelcomed, isAvailable, enableVoiceControl, welcome]);

  // Anunciar cambios de página automáticamente
  useEffect(() => {
    if (enableVoiceControl && isAvailable && hasWelcomed) {
      // Esperar 300ms para que se renderice la nueva página
      setTimeout(() => {
        announceCurrentPage();
      }, 300);
    }
  }, [location.pathname, hasWelcomed, enableVoiceControl, isAvailable]);

  // Iniciar escucha automáticamente si está habilitado
  useEffect(() => {
    if (enableVoiceControl && isAvailable && !isListening) {
      startListening();
    }
  }, [enableVoiceControl, isAvailable]);

  const value: VoiceNavigationContextType = {
    isListening,
    startListening,
    stopListening,
    speak,
    announceCurrentPage,
    enableVoiceControl,
    setEnableVoiceControl,
  };

  return (
    <VoiceNavigationContext.Provider value={value}>
      {children}
    </VoiceNavigationContext.Provider>
  );
};
