import type { ReactNode } from 'react';
import { PlayerProvider } from '../context/PlayerContext';
import type { Profile } from '../types';

interface PlayerWrapperOptions {
  email: string | null;
  /** When provided, seeds a stub Profile with this id into context. */
  profileId?: string | null;
}

/** Minimal stub profile used when tests only need the player id. */
function makeStubProfile(id: string): Profile {
  return {
    id,
    email: 'stub@test.com',
    firstName: 'Stub',
    lastName: 'Player',
    phone: '000-0000',
    gender: 'Male',
    dob: '2000-01-01',
    centerName: 'Test Center',
    createdAt: '2024-01-01T00:00:00Z',
  };
}

/**
 * Test helper: creates a React wrapper that pre-populates PlayerContext.
 * Use with renderHook's `wrapper` option.
 *
 * Examples:
 *   createPlayerWrapper({ email: 'user@example.com' })           // email only
 *   createPlayerWrapper({ email: null, profileId: 'player-1' })  // profile only
 */
export function createPlayerWrapper(
  options: PlayerWrapperOptions,
): ({ children }: { children: ReactNode }) => React.ReactElement {
  const initialProfile = options.profileId != null ? makeStubProfile(options.profileId) : undefined;

  return function Wrapper({ children }: { children: ReactNode }): React.ReactElement {
    return (
      <PlayerProvider initialEmail={options.email} initialProfile={initialProfile}>
        {children}
      </PlayerProvider>
    );
  };
}
