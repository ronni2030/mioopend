/**
 * Hook para gestionar tickets de soporte
 */

import { useState, useEffect } from 'react';
import { supportService, type TicketSoporte } from '../services/supportService';

export const useSupport = (idUsuario?: number) => {
  const [tickets, setTickets] = useState<TicketSoporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar tickets del usuario
  const loadTickets = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await supportService.getByUsuario(userId);
      setTickets(data);
    } catch (err) {
      console.error('[useSupport] Error loading tickets:', err);
      setError('Error al cargar tickets');
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente si se proporciona idUsuario
  useEffect(() => {
    if (idUsuario) {
      loadTickets(idUsuario);
    }
  }, [idUsuario]);

  // Crear nuevo ticket
  const createTicket = async (data: {
    asunto: string;
    descripcion: string;
    prioridad?: 'baja' | 'media' | 'alta';
  }): Promise<boolean> => {
    if (!idUsuario) {
      setError('Usuario no autenticado');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const newTicket = await supportService.create({
        idUsuario,
        ...data,
      });

      setTickets((prev) => [newTicket, ...prev]);

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Ticket de soporte creado correctamente');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useSupport] Error creating ticket:', err);
      setError('Error al crear ticket');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar ticket (agregar más detalles)
  const updateTicket = async (
    id: number,
    data: {
      descripcion?: string;
      asunto?: string;
    }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await supportService.update(id, data);

      setTickets((prev) =>
        prev.map((ticket) => (ticket.idTicket === id ? updated : ticket))
      );

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Ticket actualizado');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useSupport] Error updating ticket:', err);
      setError('Error al actualizar ticket');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Archivar ticket
  const archiveTicket = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await supportService.archive(id);

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.idTicket === id ? { ...ticket, activo: false } : ticket
        )
      );

      // Feedback de voz
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Ticket archivado');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }

      return true;
    } catch (err) {
      console.error('[useSupport] Error archiving ticket:', err);
      setError('Error al archivar ticket');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Leer tickets por voz
  const readTickets = () => {
    if ('speechSynthesis' in window) {
      if (tickets.length === 0) {
        const utterance = new SpeechSynthesisUtterance('No tienes tickets de soporte');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
        return;
      }

      tickets.forEach((ticket) => {
        const texto = `Ticket: ${ticket.asunto}. Estado: ${ticket.estado}. Prioridad: ${ticket.prioridad}`;
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  // Leer un ticket específico
  const readTicket = (ticket: TicketSoporte) => {
    if ('speechSynthesis' in window) {
      let texto = `Ticket: ${ticket.asunto}. ${ticket.descripcion}. Estado: ${ticket.estado}. Prioridad: ${ticket.prioridad}`;

      if (ticket.respuesta) {
        texto += `. Respuesta: ${ticket.respuesta}`;
      }

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    tickets,
    loading,
    error,
    loadTickets,
    createTicket,
    updateTicket,
    archiveTicket,
    readTickets,
    readTicket,
  };
};
