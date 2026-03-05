import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getProfileByEmail, getProfileById } from './profileHandler';
import type { Profile } from '../types';

// Mock the repository module — handler tests must not touch the filesystem
vi.mock('../repositories/profileRepository');
import { profileRepository } from '../repositories/profileRepository';

const mockProfile: Profile = {
  id: '47cb55dd-134d-459b-8892-bbba4f512399',
  email: 'sabrina.williams@example.com',
  firstName: 'Sabrina',
  lastName: 'Williams',
  phone: '+1-674-268-2062',
  gender: 'Female',
  dob: '2014-04-06',
  centerName: 'Costa Mesa',
  createdAt: '2023-11-16T00:00:00Z',
};

// Factory for a minimal mock Response object that records what was sent
const mockRes = () => {
  const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
  // status() must return the same res so .status(404).json(...) chaining works
  vi.mocked(res.status).mockReturnValue(res);
  return res;
};

beforeEach(() => vi.clearAllMocks());

describe('getProfileByEmail', () => {
  it('returns 400 when email query param is missing', async () => {
    const req = { query: {} } as unknown as Request;
    const res = mockRes();

    await getProfileByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'email query param is required',
    });
  });

  it('returns 404 when no profile matches the email', async () => {
    vi.mocked(profileRepository.findByEmail).mockReturnValue(undefined);
    const req = { query: { email: 'unknown@example.com' } } as unknown as Request;
    const res = mockRes();

    await getProfileByEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Profile not found' });
  });

  it('returns 200 with the profile data when found', async () => {
    vi.mocked(profileRepository.findByEmail).mockReturnValue(mockProfile);
    const req = { query: { email: mockProfile.email } } as unknown as Request;
    const res = mockRes();

    await getProfileByEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockProfile });
  });
});

describe('getProfileById', () => {
  it('returns 404 when no profile matches the id', async () => {
    vi.mocked(profileRepository.findById).mockReturnValue(undefined);
    const req = { params: { id: 'non-existent' } } as unknown as Request;
    const res = mockRes();

    await getProfileById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Profile not found' });
  });

  it('returns 200 with the profile data when found', async () => {
    vi.mocked(profileRepository.findById).mockReturnValue(mockProfile);
    const req = { params: { id: mockProfile.id } } as unknown as Request;
    const res = mockRes();

    await getProfileById(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockProfile });
  });
});
