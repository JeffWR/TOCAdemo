import { describe, it, expect } from 'vitest';
import { sessionRepository } from './sessionRepository';

const SABRINA_ID = '47cb55dd-134d-459b-8892-bbba4f512399';
const FIRST_SESSION_ID = '008bfbdd-7914-4488-bf3a-915d998119f1';

describe('sessionRepository', () => {
  describe('findAll', () => {
    it('returns all 15 sessions', () => {
      expect(sessionRepository.findAll()).toHaveLength(15);
    });
  });

  describe('findById', () => {
    it('returns the correct session for a known id', () => {
      const session = sessionRepository.findById(FIRST_SESSION_ID);
      expect(session).toBeDefined();
      expect(session?.playerId).toBe(SABRINA_ID);
    });

    it('returns undefined for an unknown id', () => {
      expect(sessionRepository.findById('non-existent')).toBeUndefined();
    });
  });

  describe('findByPlayerId', () => {
    it('returns only the 5 sessions belonging to that player', () => {
      const sessions = sessionRepository.findByPlayerId(SABRINA_ID);
      expect(sessions).toHaveLength(5);
      sessions.forEach(s => expect(s.playerId).toBe(SABRINA_ID));
    });

    it('returns an empty array for an unknown player id', () => {
      expect(sessionRepository.findByPlayerId('non-existent')).toHaveLength(0);
    });
  });
});
