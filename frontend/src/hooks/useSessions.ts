import { useEffect, useState } from 'react';
import type { TrainingSession } from '../types';
import { usePlayerContext } from '../context/PlayerContext';
import { getSessionsByPlayer } from '../services/sessionService';

interface UseSessionsResult {
  sessions: TrainingSession[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetch all training sessions for the logged-in player.
 * Reads the player id from the resolved profile in context.
 * Does nothing until the profile is available.
 */
export function useSessions(): UseSessionsResult {
  const { profile } = usePlayerContext();
  const playerId = profile?.id ?? null;

  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(playerId !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playerId === null) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    getSessionsByPlayer(playerId)
      .then((data) => {
        if (!cancelled) setSessions(data);
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

  return { sessions, loading, error };
}
