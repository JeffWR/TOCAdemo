import { readFileSync } from 'fs';
import { join } from 'path';
import type { Appointment } from '../types';

// Loaded once at module init — same pattern as other repositories.
const appointments = JSON.parse(
  readFileSync(join(__dirname, '../../../sampledata/appointments.json'), 'utf-8'),
) as Appointment[];

export const appointmentRepository = {
  findAll: (): Appointment[] => appointments,

  findById: (id: string): Appointment | undefined => appointments.find(a => a.id === id),

  findByPlayerId: (playerId: string): Appointment[] =>
    appointments.filter(a => a.playerId === playerId),
};
