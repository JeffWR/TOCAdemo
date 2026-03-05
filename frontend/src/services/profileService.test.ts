import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';
import { getProfileByEmail, getProfileById } from './profileService';
import type { Profile } from '../types';

// We mock the apiFetch module — profileService shouldn't know about fetch internals.
// This is a unit test of the service layer only.

const mockProfile: Profile = {
  id: 'abc123',
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

describe('getProfileByEmail', () => {
  it('calls the correct endpoint and returns the profile', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue(mockProfile);

    const result = await getProfileByEmail('player@toca.com');

    expect(spy).toHaveBeenCalledWith('/api/profiles?email=player%40toca.com');
    expect(result).toEqual(mockProfile);
  });

  it('URL-encodes special characters in the email', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue(mockProfile);

    await getProfileByEmail('user+tag@example.com');

    expect(spy).toHaveBeenCalledWith('/api/profiles?email=user%2Btag%40example.com');
  });

  it('propagates ApiError thrown by apiFetch', async () => {
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new api.ApiError('Not found'));

    await expect(getProfileByEmail('nobody@toca.com')).rejects.toBeInstanceOf(api.ApiError);
  });
});

describe('getProfileById', () => {
  it('calls the correct endpoint and returns the profile', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue(mockProfile);

    const result = await getProfileById('abc123');

    expect(spy).toHaveBeenCalledWith('/api/profiles/abc123');
    expect(result).toEqual(mockProfile);
  });

  it('propagates ApiError thrown by apiFetch', async () => {
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new api.ApiError('Not found'));

    await expect(getProfileById('missing')).rejects.toBeInstanceOf(api.ApiError);
  });
});
