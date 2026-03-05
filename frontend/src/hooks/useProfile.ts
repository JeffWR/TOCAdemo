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
  const { email, setProfile } = usePlayerContext();
  // Start loading immediately if email is already in context on mount.
  const [loading, setLoading] = useState<boolean>(email !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email === null) return;

    let cancelled = false;

    setLoading(true);
    setError(null);

    getProfileByEmail(email)
      .then((data) => {
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
  }, [email, setProfile]);

  return { loading, error };
}
