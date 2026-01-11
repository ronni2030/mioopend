/**
 * Soporte - Diseño estético modular funcional
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { useSupport } from '../features/support/hooks/useSupport';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Input, Textarea } from '../shared/components/ui';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const { tickets, loading, createTicket } = useSupport(userId);

  const [showForm, setShowForm] = useState(false);
  const [asunto, setAsunto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!asunto.trim() || !descripcion.trim()) {
      speak('Completa todos los campos', 'high');
      return;
    }

    const success = await createTicket({ asunto, descripcion, prioridad });

    if (success) {
      setAsunto('');
      setDescripcion('');
      setPrioridad('media');
      setShowForm(false);
    }
  };

  return (
    <PageLayout title="Soporte Técnico">
      <div className="space-y-4">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'danger' : 'primary'}
          fullWidth
          className="stagger-item"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Ticket'}
        </Button>

        {showForm && (
          <Card className="stagger-item">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Asunto"
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Ej: Error al calcular ruta"
                required
              />

            <div>
              <label className="block text-sm font-bold text-purple-200 drop-shadow mb-2">Prioridad</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'baja', label: 'Baja', icon: '🟢' },
                  { value: 'media', label: 'Media', icon: '🟡' },
                  { value: 'alta', label: 'Alta', icon: '🔴' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPrioridad(opt.value as any)}
                    className={`p-3 rounded-xl text-sm font-semibold smooth-transition ${
                      prioridad === opt.value
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
              rows={4}
              placeholder="Describe el problema..."
            />

            <Button
              type="submit"
              disabled={loading}
              variant="success"
              fullWidth
            >
              ✅ Crear Ticket
            </Button>
          </form>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">Mis Tickets ({tickets.length})</h3>
          {loading ? (
            <Card className="text-center py-4 stagger-item">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-purple-200 font-semibold">Cargando...</p>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="text-center py-6 stagger-item">
              <p className="text-2xl mb-2">🎫</p>
              <p className="text-purple-300">No hay tickets de soporte</p>
            </Card>
          ) : (
            tickets.map((ticket, index) => (
              <Card
                key={ticket.idTicket}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold drop-shadow flex-1">{ticket.asunto}</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                      ticket.estado === 'abierto' ? 'bg-yellow-600/80 border-yellow-400/50' :
                      ticket.estado === 'en_proceso' ? 'bg-blue-600/80 border-blue-400/50' : 'bg-green-600/80 border-green-400/50'
                    }`}>
                      {ticket.estado.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                      ticket.prioridad === 'alta' ? 'bg-red-600/80 border-red-400/50' :
                      ticket.prioridad === 'media' ? 'bg-yellow-600/80 border-yellow-400/50' : 'bg-green-600/80 border-green-400/50'
                    }`}>
                      {ticket.prioridad}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-purple-200">{ticket.descripcion}</p>
                {ticket.respuesta && (
                  <div className="mt-3 p-3 bg-blue-900/30 backdrop-blur-sm rounded-lg text-sm border border-blue-500/30">
                    <p className="font-bold text-blue-300 mb-1">💬 Respuesta del Equipo:</p>
                    <p className="text-purple-100">{ticket.respuesta}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SupportPage;
