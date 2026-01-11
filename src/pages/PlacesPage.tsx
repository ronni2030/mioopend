/**
 * Lugares Favoritos - Diseño estético modular funcional
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { placesService } from '../features/places/services/placesService';
import type { Place } from '../features/places/types/place.types';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Input, Textarea } from '../shared/components/ui';

const PlacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    type: 'destino_frecuente' as 'parada_segura' | 'destino_frecuente' | 'casa' | 'trabajo' | 'otro',
    latitude: 0,
    longitude: 0,
  });
  const [gettingLocation, setGettingLocation] = useState(false);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const data = await placesService.getByUsuario(userId);
      setPlaces(data);
      speak(`${data.length} lugares favoritos encontrados`);
    } catch (error) {
      console.error('Error loading places:', error);
      speak('Error al cargar lugares', 'high');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    speak('Obteniendo ubicación GPS');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          speak('Ubicación obtenida', 'high');
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error GPS:', error);
          speak('No se pudo obtener ubicación', 'high');
          setGettingLocation(false);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      speak('Completa nombre y dirección', 'high');
      return;
    }

    if (formData.latitude === 0 && formData.longitude === 0) {
      speak('Obtén la ubicación GPS primero', 'high');
      return;
    }

    try {
      setLoading(true);

      if (editingPlace) {
        await placesService.updatePlace(editingPlace.id, formData);
        speak('Lugar actualizado correctamente', 'high');
      } else {
        await placesService.createPlace({ ...formData, userId: userId.toString() });
        speak('Lugar agregado correctamente', 'high');
      }

      setFormData({
        name: '',
        address: '',
        description: '',
        type: 'destino_frecuente',
        latitude: 0,
        longitude: 0,
      });
      setShowForm(false);
      setEditingPlace(null);
      await loadPlaces();
    } catch (error) {
      console.error('Error saving place:', error);
      speak('Error al guardar lugar', 'high');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      address: place.address,
      description: place.description || '',
      type: place.type as any,
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setShowForm(true);
    speak(`Editando ${place.name}`);
  };

  const handleDelete = async (place: Place) => {
    if (window.confirm(`¿Eliminar ${place.name}?`)) {
      try {
        setLoading(true);
        await placesService.deletePlace(place.id);
        speak(`${place.name} eliminado`, 'high');
        await loadPlaces();
      } catch (error) {
        console.error('Error deleting place:', error);
        speak('Error al eliminar lugar', 'high');
      } finally {
        setLoading(false);
      }
    }
  };

  const typeIcons: Record<string, string> = {
    casa: '🏠',
    trabajo: '💼',
    destino_frecuente: '⭐',
    parada_segura: '🛡️',
    otro: '📍',
  };

  const typeLabels: Record<string, string> = {
    casa: 'Casa',
    trabajo: 'Trabajo',
    destino_frecuente: 'Frecuente',
    parada_segura: 'Segura',
    otro: 'Otro',
  };

  return (
    <PageLayout title="Lugares Favoritos">
      <div className="space-y-4">
        <Button
          onClick={() => {
            if (showForm && editingPlace) {
              setEditingPlace(null);
              setFormData({
                name: '',
                address: '',
                description: '',
                type: 'destino_frecuente',
                latitude: 0,
                longitude: 0,
              });
            }
            setShowForm(!showForm);
          }}
          variant={showForm ? 'danger' : 'primary'}
          fullWidth
          className="stagger-item"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Lugar'}
        </Button>

        {showForm && (
          <Card className="stagger-item">
            <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mi lugar favorito"
              required
            />

            <div>
              <label className="block text-sm font-semibold mb-2">Tipo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'casa', label: 'Casa', icon: '🏠' },
                  { value: 'trabajo', label: 'Trabajo', icon: '💼' },
                  { value: 'destino_frecuente', label: 'Frecuente', icon: '⭐' },
                  { value: 'parada_segura', label: 'Segura', icon: '🛡️' },
                  { value: 'otro', label: 'Otro', icon: '📍' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: opt.value as any })}
                    className={`p-2 rounded-xl text-sm font-semibold transition-all ${
                      formData.type === opt.value
                        ? 'bg-purple-600 scale-105'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle Principal 123"
              required
            />

            <Textarea
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Notas adicionales..."
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-purple-200 drop-shadow">Ubicación GPS *</label>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  variant="secondary"
                  size="sm"
                >
                  {gettingLocation ? '⏳ Obteniendo...' : '📍 Obtener'}
                </Button>
              </div>
              <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-3 text-sm border border-purple-500/30 shadow-inner">
                {formData.latitude !== 0 && formData.longitude !== 0 ? (
                  <p className="text-purple-100 font-mono">📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
                ) : (
                  <p className="text-purple-300">Sin ubicación GPS</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="success"
              fullWidth
            >
              ✅ {editingPlace ? 'Actualizar Lugar' : 'Guardar Lugar'}
            </Button>
          </form>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">Mis Lugares ({places.length})</h3>
          {loading && !showForm ? (
            <Card className="text-center py-4 stagger-item">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-purple-200 font-semibold">Cargando...</p>
            </Card>
          ) : places.length === 0 ? (
            <Card className="text-center py-6 stagger-item">
              <p className="text-2xl mb-2">📍</p>
              <p className="text-purple-300">No hay lugares guardados</p>
            </Card>
          ) : (
            places.map((place, index) => (
              <Card
                key={place.id}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 bounce-soft shadow-lg">
                    {typeIcons[place.type] || '📍'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold drop-shadow">{place.name}</h4>
                    <p className="text-sm text-purple-200">{place.address}</p>
                    {place.description && (
                      <p className="text-xs text-purple-300 mt-1">{place.description}</p>
                    )}
                    <span className="text-xs bg-purple-600/50 px-2 py-1 rounded-full mt-2 inline-block border border-purple-400/30">
                      {typeLabels[place.type]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(place)}
                      className="text-blue-400 hover:text-blue-300 hover:scale-110 smooth-transition text-xl drop-shadow"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(place)}
                      className="text-red-400 hover:text-red-300 hover:scale-110 smooth-transition text-xl drop-shadow"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default PlacesPage;
