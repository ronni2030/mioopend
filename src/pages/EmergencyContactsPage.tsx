/**
 * Contactos de Emergencia - Diseño estético modular funcional
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { useEmergencyContacts } from '../features/emergency-contacts/hooks/useEmergencyContacts';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Input } from '../shared/components/ui';

const EmergencyContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const { contacts, loading, addContact, deleteContact } = useEmergencyContacts(userId);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    parentesco: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      speak('Completa nombre y teléfono', 'high');
      return;
    }

    const success = await addContact(formData, userId);

    if (success) {
      setFormData({ nombre: '', apellido: '', telefono: '', parentesco: '' });
      setShowForm(false);
    }
  };

  return (
    <PageLayout title="Contactos de Emergencia">
      <div className="space-y-4">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'danger' : 'primary'}
          fullWidth
          className="stagger-item"
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Contacto'}
        </Button>

        {showForm && (
          <Card className="stagger-item">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Juan"
                required
              />

              <Input
                label="Apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Pérez"
              />

              <Input
                label="Teléfono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="0991234567"
                required
              />

              <Input
                label="Parentesco"
                type="text"
                value={formData.parentesco}
                onChange={(e) => setFormData({ ...formData, parentesco: e.target.value })}
                placeholder="Hermano, Amigo..."
              />

              <Button
                type="submit"
                disabled={loading}
                variant="success"
                fullWidth
              >
                ✅ Guardar Contacto
              </Button>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-bold drop-shadow-lg text-purple-200">Mis Contactos ({contacts.length})</h3>
          {loading ? (
            <Card className="text-center py-4 stagger-item">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
              <p className="text-purple-200 font-semibold">Cargando...</p>
            </Card>
          ) : contacts.length === 0 ? (
            <Card className="text-center py-6 stagger-item">
              <p className="text-2xl mb-2">📞</p>
              <p className="text-purple-300">No hay contactos de emergencia</p>
            </Card>
          ) : (
            contacts.map((contact, index) => (
              <Card
                key={contact.id}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0 bounce-soft shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold drop-shadow">{contact.nombre} {contact.apellido}</h4>
                    <p className="text-sm text-purple-200">📞 {contact.telefono}</p>
                    {contact.parentesco && (
                      <p className="text-xs text-purple-300">👥 {contact.parentesco}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${contact.telefono}`}
                      onClick={() => speak(`Llamando a ${contact.nombre}`, 'high')}
                      className="text-green-400 hover:text-green-300 hover:scale-110 smooth-transition text-2xl drop-shadow"
                    >
                      📞
                    </a>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar ${contact.nombre}?`)) {
                          deleteContact(contact.id);
                        }
                      }}
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

export default EmergencyContactsPage;
