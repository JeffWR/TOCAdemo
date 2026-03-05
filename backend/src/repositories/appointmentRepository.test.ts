import { describe, it, expect } from 'vitest';
import { appointmentRepository } from './appointmentRepository';

const SABRINA_ID = '47cb55dd-134d-459b-8892-bbba4f512399';
const FIRST_APPOINTMENT_ID = 'd9332a5a-aa28-46c6-a370-26413ba0ba1c';

describe('appointmentRepository', () => {
  describe('findAll', () => {
    it('returns all 9 appointments', () => {
      expect(appointmentRepository.findAll()).toHaveLength(9);
    });
  });

  describe('findById', () => {
    it('returns the correct appointment for a known id', () => {
      const appt = appointmentRepository.findById(FIRST_APPOINTMENT_ID);
      expect(appt).toBeDefined();
      expect(appt?.playerId).toBe(SABRINA_ID);
    });

    it('returns undefined for an unknown id', () => {
      expect(appointmentRepository.findById('non-existent')).toBeUndefined();
    });
  });

  describe('findByPlayerId', () => {
    it('returns only the 3 appointments belonging to that player', () => {
      const appts = appointmentRepository.findByPlayerId(SABRINA_ID);
      expect(appts).toHaveLength(3);
      appts.forEach(a => expect(a.playerId).toBe(SABRINA_ID));
    });

    it('returns an empty array for an unknown player id', () => {
      expect(appointmentRepository.findByPlayerId('non-existent')).toHaveLength(0);
    });
  });
});
