import { describe, it, expect } from 'vitest';
import { profileRepository } from './profileRepository';

// Real UUIDs from sampledata/profiles.json
const SABRINA_ID = '47cb55dd-134d-459b-8892-bbba4f512399';
const SABRINA_EMAIL = 'sabrina.williams@example.com';

describe('profileRepository', () => {
  describe('findAll', () => {
    it('returns all 3 profiles', () => {
      const profiles = profileRepository.findAll();
      expect(profiles).toHaveLength(3);
    });

    it('returns objects with the correct shape', () => {
      const [first] = profileRepository.findAll();
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('email');
      expect(first).toHaveProperty('firstName');
      expect(first).toHaveProperty('lastName');
    });
  });

  describe('findById', () => {
    it('returns the correct profile for a known id', () => {
      const profile = profileRepository.findById(SABRINA_ID);
      expect(profile).toBeDefined();
      expect(profile?.firstName).toBe('Sabrina');
      expect(profile?.lastName).toBe('Williams');
    });

    it('returns undefined for an unknown id', () => {
      const profile = profileRepository.findById('non-existent-id');
      expect(profile).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('returns the correct profile for a known email', () => {
      const profile = profileRepository.findByEmail(SABRINA_EMAIL);
      expect(profile).toBeDefined();
      expect(profile?.id).toBe(SABRINA_ID);
    });

    it('returns undefined for an unknown email', () => {
      const profile = profileRepository.findByEmail('unknown@example.com');
      expect(profile).toBeUndefined();
    });
  });
});
