import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { TrainingSession } from '../../types';
import SessionDetailPage from './SessionDetailPage';

vi.mock('../../hooks/useSession', () => ({ useSession: vi.fn() }));
vi.mock('../../hooks/useSessions', () => ({ useSessions: vi.fn() }));

import { useSession } from '../../hooks/useSession';
import { useSessions } from '../../hooks/useSessions';

const session: TrainingSession = {
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
};

function renderPage(): void {
  render(
    <MemoryRouter initialEntries={['/sessions/s1']}>
      <PlayerProvider initialEmail="player@example.com">
        <Routes>
          <Route path="/sessions/:id" element={<SessionDetailPage />} />
        </Routes>
      </PlayerProvider>
    </MemoryRouter>,
  );
}

const allSessions: TrainingSession[] = [
  session,
  {
    ...session,
    id: 's2',
    score: 73,
    numberOfGoals: 8,
    bestStreak: 10,
    numberOfBalls: 180,
    numberOfExercises: 5,
  },
];

describe('SessionDetailPage', () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({ session: null, loading: false, error: null });
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: null });
  });

  it('shows a loading spinner while fetching', () => {
    vi.mocked(useSession).mockReturnValue({ session: null, loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('shows an error message when fetch fails', () => {
    vi.mocked(useSession).mockReturnValue({ session: null, loading: false, error: 'Not found' });
    renderPage();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders trainer name as heading', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    renderPage();
    expect(screen.getByRole('heading', { name: /Coach Alex/i })).toBeDefined();
  });

  it('renders comparison rows for key stats', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    vi.mocked(useSessions).mockReturnValue({ sessions: allSessions, loading: false, error: null });
    renderPage();
    expect(screen.getByText(/score/i)).toBeDefined();
    expect(screen.getByText(/goals/i)).toBeDefined();
    expect(screen.getByText(/best streak/i)).toBeDefined();
  });

  it('renders a back link to /', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    renderPage();
    const backLink = screen.getByRole('link', { name: /dashboard/i });
    expect(backLink.getAttribute('href')).toBe('/');
  });

  it('renders a Duration stat badge', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    renderPage();
    expect(screen.getByLabelText(/duration/i)).toBeDefined();
    expect(screen.getByText('1h 0m')).toBeDefined();
  });
});
