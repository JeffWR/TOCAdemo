import { useEffect, useState } from 'react';
import { usePlayerContext } from '../context/PlayerContext';
import { getProfileByEmail } from '../services/profileService';

interface UseProfileResult {
  loading: boolean;
  error: string | null;
}

/**
 * Fetch the current player's profile using the email stored in PlayerContext.
 * On success, writes the resolved Profile into PlayerContext so that
 * useSessions and useAppointments can read profile.id without re-fetching.
 * - Returns { loading: true } while the fetch is in-flight.
 * - Returns { error } if the fetch fails.
 * - Does nothing if email is null (not yet logged in).
 *
 * Callers read the profile value directly from usePlayerContext().profile.
 */
export function useProfile(): UseProfileResult {
  const { email, profile, setProfile } = usePlayerContext();
  // Skip the fetch if the profile is already resolved in context.
  const [loading, setLoading] = useState<boolean>(email !== null && profile === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email === null || profile !== null) return;

    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard async fetch pattern; React 18+ batches effect-triggered state updates
    setLoading(true);
    setError(null);

    getProfileByEmail(email)
      .then(data => {
        if (!cancelled) {
          setProfile(data); // write resolved profile into context for downstream hooks
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    // Cleanup: if email changes before fetch completes, ignore stale response
    return () => {
      cancelled = true;
    };
  }, [email, profile, setProfile]);

  return { loading, error };
}
