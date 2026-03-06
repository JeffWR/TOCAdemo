import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { Appointment, TrainingSession } from '../../types';
import HomePage from './HomePage';

vi.mock('../../hooks/useProfile', () => ({ useProfile: () => ({ loading: false, error: null }) }));
vi.mock('../../hooks/useSessions', () => ({ useSessions: vi.fn() }));
vi.mock('../../hooks/useAppointments', () => ({ useAppointments: vi.fn() }));

import { useAppointments } from '../../hooks/useAppointments';
import { useSessions } from '../../hooks/useSessions';

const sessions: TrainingSession[] = [
  {
    id: 's1', playerId: 'p1', trainerName: 'Coach Alex',
    startTime: '2024-03-01T09:00:00Z', endTime: '2024-03-01T10:00:00Z',
    numberOfBalls: 200, bestStreak: 15, numberOfGoals: 12,
    score: 87, avgSpeedOfPlay: 3.4, numberOfExercises: 6,
  },
];

const appointments: Appointment[] = [
  {
    id: 'a1', playerId: 'p1', trainerName: 'Coach Sam',
    startTime: '2099-04-10T14:00:00Z', endTime: '2099-04-10T15:00:00Z',
  },
];

function renderPage(): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="player@example.com">
        <HomePage />
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: null });
    vi.mocked(useAppointments).mockReturnValue({ appointments: [], loading: false, error: null });
  });

  it('shows a loading spinner while data is fetching', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('shows an error message when sessions fail', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: 'Failed' });
    renderPage();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders a Training Sessions section heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /training sessions/i })).toBeDefined();
  });

  it('renders an Upcoming Appointments section heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /upcoming appointments/i })).toBeDefined();
  });

  it('renders sessions and appointments together', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions, loading: false, error: null });
    vi.mocked(useAppointments).mockReturnValue({ appointments, loading: false, error: null });
    renderPage();
    expect(screen.getByText('Coach Alex')).toBeDefined();
    expect(screen.getByText('Coach Sam')).toBeDefined();
  });
});
