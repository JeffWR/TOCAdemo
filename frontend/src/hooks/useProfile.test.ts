import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfile } from './useProfile';
import * as profileService from '../services/profileService';
import type { Profile } from '../types';
import { createPlayerWrapper } from '../test/playerWrapper';

// Hooks that call usePlayerContext need a provider wrapper.
// We import a helper that wraps children in <PlayerProvider>.

const mockProfile: Profile = {
  id: 'p1',
  email: 'player@toca.com',
  firstName: 'Jordan',
  lastName: 'Smith',
  phone: '555-0100',
  gender: 'Male',
  dob: '1998-05-12',
  centerName: 'TOCA West',
  createdAt: '2024-01-01T00:00:00Z',
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('useProfile', () => {
  it('returns loading: true initially and loading: false after fetch', async () => {
    vi.spyOn(profileService, 'getProfileByEmail').mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useProfile(), {
      wrapper: createPlayerWrapper({ email: 'player@toca.com' }),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.spyOn(profileService, 'getProfileByEmail').mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useProfile(), {
      wrapper: createPlayerWrapper({ email: 'player@toca.com' }),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Not found');
  });

  it('does not fetch and starts with loading: false when email is null', () => {
    const spy = vi.spyOn(profileService, 'getProfileByEmail');

    const { result } = renderHook(() => useProfile(), {
      wrapper: createPlayerWrapper({ email: null }),
    });

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
