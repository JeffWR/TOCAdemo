import { useEffect, useState } from 'react';
import type { TrainingSession } from '../types';
import { getSessionById } from '../services/sessionService';

interface UseSessionResult {
  session: TrainingSession | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch a single training session by id.
 * Used on the session detail page where the id comes from the URL param.
 */
export function useSession(id: string): UseSessionResult {
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getSessionById(id)
      .then((data) => {
        if (!cancelled) setSession(data);
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
  }, [id]);

  return { session, loading, error };
}
