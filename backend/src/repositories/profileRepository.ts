import { readFileSync } from 'fs';
import { join } from 'path';
import type { Profile } from '../types';

// Loaded once at module init — data is read-only and never changes at runtime.
// Cast is safe: the file is a controlled fixture matching the Profile interface.
const profiles = JSON.parse(
  readFileSync(join(__dirname, '../../../sampledata/profiles.json'), 'utf-8'),
) as Profile[];

export const profileRepository = {
  findAll: (): Profile[] => profiles,

  findById: (id: string): Profile | undefined => profiles.find(p => p.id === id),

  findByEmail: (email: string): Profile | undefined => profiles.find(p => p.email === email),
};
