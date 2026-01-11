import { useState, useEffect } from 'react';
import type { ContactoEmergencia } from '../types';
import { contactsService } from '../services/contactsService';

export const useEmergencyContacts = (idUsuario?: number) => {
  const [contacts, setContacts] = useState<ContactoEmergencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar contactos del usuario
  const loadContacts = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsService.getByUsuario(userId);
      setContacts(data);
    } catch (err) {
      console.error('[useEmergencyContacts] Error loading contacts:', err);
      setError('Error al cargar contactos');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente si se proporciona idUsuario
  useEffect(() => {
    if (idUsuario) {
      loadContacts(idUsuario);
    }
  }, [idUsuario]);

  // Agregar nuevo contacto
  const addContact = async (
    contact: Omit<ContactoEmergencia, 'id'>,
    userId: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newContact = await contactsService.create({
        ...contact,
        idUsuario: userId,
      });

      setContacts((prev) => [...prev, newContact]);

      // Feedback por voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Contacto guardado correctamente');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useEmergencyContacts] Error creating contact:', err);
      setError('Error al crear contacto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contacto existente
  const updateContact = async (
    id: string,
    data: Partial<Omit<ContactoEmergencia, 'id'>>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await contactsService.update(parseInt(id), data);

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );

      // Feedback por voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Contacto actualizado correctamente');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useEmergencyContacts] Error updating contact:', err);
      setError('Error al actualizar contacto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar contacto
  const deleteContact = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await contactsService.delete(parseInt(id));

      setContacts((prev) => prev.filter((c) => c.id !== id));

      // Feedback por voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Contacto eliminado');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useEmergencyContacts] Error deleting contact:', err);
      setError('Error al eliminar contacto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Leer contactos por voz
  const readContacts = () => {
    if ('speechSynthesis' in window) {
      if (contacts.length === 0) {
        const utterance = new SpeechSynthesisUtterance('No tienes contactos registrados');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
        return;
      }

      contacts.forEach((c: ContactoEmergencia) => {
        const text = `${c.nombre} ${c.apellido}, relación: ${c.parentesco}, teléfono: ${c.telefono}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  // Leer un contacto específico por voz
  const readContact = (contact: ContactoEmergencia) => {
    if ('speechSynthesis' in window) {
      const text = `${contact.nombre} ${contact.apellido}, relación: ${contact.parentesco}, teléfono: ${contact.telefono}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    contacts,
    loading,
    error,
    loadContacts,
    addContact,
    updateContact,
    deleteContact,
    readContacts,
    readContact,
  };
};
