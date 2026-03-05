import { readFileSync } from 'fs';
import { join } from 'path';
import type { TrainingSession } from '../types';

// Loaded once at module init — same pattern as profileRepository.
const sessions = JSON.parse(
  readFileSync(join(__dirname, '../../../sampledata/trainingSessions.json'), 'utf-8'),
) as TrainingSession[];

export const sessionRepository = {
  findAll: (): TrainingSession[] => sessions,

  findById: (id: string): TrainingSession | undefined => sessions.find(s => s.id === id),

  findByPlayerId: (playerId: string): TrainingSession[] =>
    sessions.filter(s => s.playerId === playerId),
};
