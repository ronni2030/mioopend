/**
 * Incidencias - Diseño estético modular funcional
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { useIncidents } from '../features/incidents/hooks/useIncidents';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Textarea } from '../shared/components/ui';

const IncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const { incidents, loading, createIncident, deleteIncident } = useIncidents(userId);

  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<'obstaculo' | 'obra' | 'zona_peligrosa' | 'otro'>('obstaculo');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacionActual, setUbicacionActual] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUbicacionActual({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          speak('Ubicación obtenida');
        },
        (error) => {
          console.error('Error GPS:', error);
          speak('No se pudo obtener ubicación', 'high');
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ubicacionActual) {
      speak('Esperando ubicación GPS', 'high');
      return;
    }

    if (!descripcion.trim()) {
      speak('Falta descripción', 'high');
      return;
    }

    const success = await createIncident({
      tipo,
      descripcion,
      latitud: ubicacionActual.lat,
      longitud: ubicacionActual.lng,
    });

    if (success) {
      setDescripcion('');
      setShowForm(false);
    }
  };

  return (
    <PageLayout title="Incidencias">
      <div className="space-y-4">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'danger' : 'primary'}
          fullWidth
          className="stagger-item"
        >
          {showForm ? '❌ Cancelar' : '➕ Nueva Incidencia'}
        </Button>

        {showForm && (
          <Card className="stagger-item">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-purple-200 drop-shadow mb-2">Tipo de Incidencia</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'obstaculo', label: 'Obstáculo', icon: '🚧' },
                  { value: 'obra', label: 'Obra', icon: '🏗️' },
                  { value: 'zona_peligrosa', label: 'Peligro', icon: '⚠️' },
                  { value: 'otro', label: 'Otro', icon: '❓' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipo(opt.value as any)}
                    className={`p-3 rounded-xl text-sm font-semibold smooth-transition ${
                      tipo === opt.value
                        ? 'bg-purple-600 scale-105 shadow-lg border-2 border-purple-400'
                        : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Describe la incidencia..."
            />

            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-3 text-sm border border-purple-500/30 shadow-inner">
              <p className="text-purple-100 font-mono">
                📍 {ubicacionActual
                  ? `${ubicacionActual.lat.toFixed(4)}, ${ubicacionActual.lng.toFixed(4)}`
                  : 'Obteniendo ubicación...'}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !ubicacionActual}
              variant="success"
              fullWidth
            >
              ✅ Enviar Reporte
            </Button>
          </form>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">Mis Reportes ({incidents.length})</h3>
          {loading ? (
            <Card className="text-center py-4 stagger-item">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-purple-200 font-semibold">Cargando...</p>
            </Card>
          ) : incidents.length === 0 ? (
            <Card className="text-center py-6 stagger-item">
              <p className="text-2xl mb-2">🚧</p>
              <p className="text-purple-300">No hay incidencias reportadas</p>
            </Card>
          ) : (
            incidents.map((inc, index) => (
              <Card
                key={inc.idIncidencia}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl bounce-soft">
                        {inc.tipo === 'obstaculo' && '🚧'}
                        {inc.tipo === 'obra' && '🏗️'}
                        {inc.tipo === 'zona_peligrosa' && '⚠️'}
                        {inc.tipo === 'otro' && '❓'}
                      </span>
                      <span className="font-bold drop-shadow capitalize">{inc.tipo.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-purple-200">{inc.descripcion}</p>
                    <span className="text-xs bg-blue-600/50 px-2 py-1 rounded-full mt-2 inline-block border border-blue-400/30">
                      Estado: {inc.estado}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteIncident(inc.idIncidencia)}
                    className="text-red-400 hover:text-red-300 hover:scale-110 smooth-transition text-xl drop-shadow"
                  >
                    🗑️
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default IncidentsPage;
