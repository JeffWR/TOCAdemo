import { useEffect, useState } from 'react';
import { usePlayerContext } from '../context/PlayerContext';
import { getAppointmentsByPlayer } from '../services/appointmentService';
import type { Appointment } from '../types';

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetch all appointments for the logged-in player.
 * Reads the player id from the resolved profile in context.
 * Does nothing until the profile is available.
 */
export function useAppointments(): UseAppointmentsResult {
  const { profile } = usePlayerContext();
  const playerId = profile?.id ?? null;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(playerId !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playerId === null) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    getAppointmentsByPlayer(playerId)
      .then(data => {
        if (!cancelled) setAppointments(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  return { appointments, loading, error };
}
