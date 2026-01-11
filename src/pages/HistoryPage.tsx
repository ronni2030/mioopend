/**
 * Historial de Navegación - Diseño Modular Aesthetic
 */

import React, { useState, useEffect } from 'react';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { historyService } from '../features/navigation-history/services/historyService';
import type { Route } from '../features/navigation-history/types/history.types';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button } from '../shared/components/ui';

const HistoryPage: React.FC = () => {
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const [history, setHistory] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await historyService.getHistory(userId);
      setHistory(data);
      speak(`${data.length} rutas en el historial`);
    } catch (error) {
      console.error('Error loading history:', error);
      speak('Error al cargar historial', 'high');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = showFavoritesOnly
    ? history.filter(item => item.isFavorite)
    : history;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  const toggleFavorite = async (route: Route) => {
    try {
      const updatedRoute = { ...route, isFavorite: !route.isFavorite };
      await historyService.saveRoute(updatedRoute, userId);
      await loadHistory();
      speak(route.isFavorite ? 'Quitado de favoritos' : 'Agregado a favoritos', 'high');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      speak('Error al actualizar favorito', 'high');
    }
  };

  const deleteRoute = async (route: Route) => {
    if (window.confirm(`¿Eliminar ruta a ${route.destination}?`)) {
      try {
        await historyService.deleteRoute(route.id);
        await loadHistory();
        speak('Ruta eliminada', 'high');
      } catch (error) {
        console.error('Error deleting route:', error);
        speak('Error al eliminar ruta', 'high');
      }
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm('¿Estás seguro de limpiar todo el historial?')) {
      try {
        await historyService.clearHistory(userId);
        setHistory([]);
        speak('Historial limpiado', 'high');
      } catch (error) {
        console.error('Error clearing history:', error);
        speak('Error al limpiar historial', 'high');
      }
    }
  };

  return (
    <PageLayout title="Historial">
      <div className="space-y-4">
        {/* Filtros */}
        <Card className="stagger-item">
          <h3 className="text-sm font-bold text-purple-200 drop-shadow mb-3">Filtrar rutas</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                speak('Mostrando todas las rutas');
              }}
              className={`p-3 rounded-xl text-sm font-semibold smooth-transition ${
                !showFavoritesOnly
                  ? 'bg-purple-600 scale-105 shadow-lg border-2 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              📋 Todas
            </button>
            <button
              onClick={() => {
                setShowFavoritesOnly(true);
                speak('Mostrando solo favoritas');
              }}
              className={`p-3 rounded-xl text-sm font-semibold smooth-transition ${
                showFavoritesOnly
                  ? 'bg-purple-600 scale-105 shadow-lg border-2 border-purple-400'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              ⭐ Favoritas
            </button>
          </div>
        </Card>

        {/* Lista de Historial */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">
            Rutas ({filteredHistory.length})
          </h3>

          {loading ? (
            <Card className="text-center py-8 stagger-item">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-purple-200 font-semibold">Cargando historial...</p>
            </Card>
          ) : filteredHistory.length === 0 ? (
            <Card className="text-center py-6 stagger-item">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-purple-300">No hay rutas en el historial</p>
            </Card>
          ) : (
            filteredHistory.map((item, index) => (
              <Card
                key={item.id}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 bounce-soft shadow-lg">
                    🧭
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-sm flex items-center gap-2 drop-shadow">
                          <span className="text-green-400">🟢</span>
                          {item.origin}
                        </p>
                        <p className="text-xs text-purple-300 my-1">↓</p>
                        <p className="font-bold text-sm flex items-center gap-2 drop-shadow">
                          <span className="text-red-400">🔴</span>
                          {item.destination}
                        </p>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold">{formatDate(item.date)}</span>
                    </div>

                    <div className="flex gap-2 mt-3 text-xs">
                      <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-purple-500/30">
                        <span className="text-purple-100 font-semibold">📏 {item.distance}</span>
                      </div>
                      <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-purple-500/30">
                        <span className="text-purple-100 font-semibold">⏱️ {item.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => toggleFavorite(item)}
                        className="text-yellow-400 hover:text-yellow-300 hover:scale-110 smooth-transition text-xl drop-shadow"
                      >
                        {item.isFavorite ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => deleteRoute(item)}
                        className="text-red-400 hover:text-red-300 hover:scale-110 smooth-transition text-xl drop-shadow"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Botón limpiar historial */}
        {history.length > 0 && (
          <Button
            onClick={clearAllHistory}
            variant="danger"
            fullWidth
            className="stagger-item"
          >
            🗑️ Limpiar Historial
          </Button>
        )}
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
