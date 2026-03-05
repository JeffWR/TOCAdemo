import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { TrainingSession } from '../../types';
import SessionListPage from './SessionListPage';

vi.mock('../../hooks/useProfile', () => ({ useProfile: () => ({ loading: false, error: null }) }));
vi.mock('../../hooks/useSessions', () => ({
  useSessions: vi.fn(),
}));

import { useSessions } from '../../hooks/useSessions';

const sessions: TrainingSession[] = [
  {
    id: 's1',
    playerId: 'p1',
    trainerName: 'Coach Alex',
    startTime: '2024-03-01T09:00:00Z',
    endTime: '2024-03-01T10:00:00Z',
    numberOfBalls: 200,
    bestStreak: 15,
    numberOfGoals: 12,
    score: 87,
    avgSpeedOfPlay: 3.4,
    numberOfExercises: 6,
  },
];

function renderPage(): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="player@example.com">
        <SessionListPage />
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('SessionListPage', () => {
  beforeEach(() => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: null });
  });

  it('shows a loading spinner while fetching', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('shows an error message when fetch fails', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: 'Network error' });
    renderPage();
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Network error')).toBeDefined();
  });

  it('renders a session list when data loads', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions, loading: false, error: null });
    renderPage();
    expect(screen.getByText('Coach Alex')).toBeDefined();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /training sessions/i })).toBeDefined();
  });
});
