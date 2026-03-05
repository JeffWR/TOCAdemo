import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { Profile } from '../../types';

interface PlayerContextValue {
  /** The email the player typed on the login screen. Null when logged out. */
  email: string | null;
  /** The profile fetched from the API after login. Null until fetch completes. */
  profile: Profile | null;
  /** Update the stored email (called when the player submits the login form). */
  setEmail: (email: string) => void;
  /** Store the resolved profile in context (called after a successful API fetch). */
  setProfile: (profile: Profile) => void;
  /** Clear all auth state (called on logout). */
  logout: () => void;
}

// The raw context — null when accessed outside the provider.
// Components should use usePlayerContext(), not this directly.
const PlayerContext = createContext<PlayerContextValue | null>(null);

interface PlayerProviderProps {
  children: ReactNode;
  /** Pre-seed the email (used in tests to skip the login step). */
  initialEmail?: string | null;
  /** Pre-seed the profile (used in tests where hooks need a resolved profile). */
  initialProfile?: Profile | null;
}

export function PlayerProvider({
  children,
  initialEmail = null,
  initialProfile = null,
}: PlayerProviderProps): ReactElement {
  const [email, setEmailState] = useState<string | null>(initialEmail);
  const [profile, setProfileState] = useState<Profile | null>(initialProfile);

  const setEmail = useCallback((newEmail: string): void => {
    setEmailState(newEmail);
  }, []);

  const setProfile = useCallback((newProfile: Profile): void => {
    setProfileState(newProfile);
  }, []);

  const logout = useCallback((): void => {
    setEmailState(null);
    setProfileState(null);
  }, []);

  return (
    <PlayerContext.Provider value={{ email, profile, setEmail, setProfile, logout }}>
      {children}
    </PlayerContext.Provider>
  );
}

/**
 * Access the player auth context.
 * Throws a descriptive error if called outside <PlayerProvider> — this is intentional.
 * A missing provider is a programmer error, not a runtime edge case.
 */
export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (ctx === null) {
    throw new Error('usePlayerContext must be used inside <PlayerProvider>');
  }
  return ctx;
}
