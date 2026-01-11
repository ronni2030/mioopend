/**
 * Perfil de Usuario - Diseño estético modular funcional
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceNavigation } from '../shared/contexts/VoiceNavigationContext';
import { usuariosService, type Usuario } from '../features/users/services/usersService';
import { PageLayout } from '../shared/components/layout/PageLayout';
import { Card, Button, Input } from '../shared/components/ui';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useVoiceNavigation();
  const [userId] = useState(1);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    nameUsers: '',
    emailUser: '',
    phoneUser: '',
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.getById(userId);
      setUser(data);
      setFormData({
        nameUsers: data.nameUsers,
        emailUser: data.emailUser,
        phoneUser: data.phoneUser,
      });
      speak('Perfil cargado');
    } catch (error) {
      console.error('Error loading profile:', error);
      speak('Error al cargar perfil', 'high');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameUsers.trim() || !formData.emailUser.trim()) {
      speak('Completa nombre y correo', 'high');
      return;
    }

    try {
      setLoading(true);
      await usuariosService.update(userId, formData);
      speak('Perfil actualizado correctamente', 'high');
      setEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      speak('Error al actualizar perfil', 'high');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Mi Perfil">
      <div className="space-y-4">
        {loading && !editing ? (
          <Card className="text-center py-8 stagger-item">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-3"></div>
            <p className="text-purple-200 font-semibold">Cargando perfil...</p>
          </Card>
        ) : (
          <>
            <Card className="text-center stagger-item">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-full w-24 h-24 flex items-center justify-center text-5xl mb-4 mx-auto bounce-soft shadow-lg">
                👤
              </div>
              <h2 className="text-2xl font-bold drop-shadow-lg">{user?.nameUsers || 'Usuario'}</h2>
              <p className="text-sm text-purple-200">@{user?.userName || 'username'}</p>
            </Card>

            {!editing ? (
              <Card className="stagger-item" style={{ animationDelay: '0.1s' }}>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-purple-300">Nombre Completo</p>
                    <p className="font-bold drop-shadow">{user?.nameUsers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300">Correo Electrónico</p>
                    <p className="font-bold drop-shadow">{user?.emailUser}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300">Teléfono</p>
                    <p className="font-bold drop-shadow">{user?.phoneUser}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300">Estado</p>
                    <span className="inline-block px-3 py-1 bg-green-600/80 border border-green-400/50 rounded-full text-xs font-semibold">
                      {user?.estado || 'activo'}
                    </span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="stagger-item" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    label="Nombre Completo"
                    type="text"
                    value={formData.nameUsers}
                    onChange={(e) => setFormData({ ...formData, nameUsers: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                  />

                  <Input
                    label="Correo Electrónico"
                    type="email"
                    value={formData.emailUser}
                    onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    required
                  />

                  <Input
                    label="Teléfono"
                    type="tel"
                    value={formData.phoneUser}
                    onChange={(e) => setFormData({ ...formData, phoneUser: e.target.value })}
                    placeholder="0991234567"
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          nameUsers: user?.nameUsers || '',
                          emailUser: user?.emailUser || '',
                          phoneUser: user?.phoneUser || '',
                        });
                        speak('Edición cancelada');
                      }}
                      variant="danger"
                      className="flex-1"
                    >
                      ❌ Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="success"
                      className="flex-1"
                    >
                      ✅ Guardar
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {!editing && (
              <Button
                onClick={() => {
                  setEditing(true);
                  speak('Modo de edición activado');
                }}
                variant="primary"
                fullWidth
                className="stagger-item"
                style={{ animationDelay: '0.2s' }}
              >
                ✏️ Editar Perfil
              </Button>
            )}

            <Button
              onClick={() => navigate('/settings')}
              variant="secondary"
              fullWidth
              className="stagger-item"
              style={{ animationDelay: '0.3s' }}
            >
              ⚙️ Ir a Configuración
            </Button>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
