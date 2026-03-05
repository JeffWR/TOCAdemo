import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { TrainingSession } from '../../types';
import SessionDetailPage from './SessionDetailPage';

vi.mock('../../hooks/useSession', () => ({
  useSession: vi.fn(),
}));

import { useSession } from '../../hooks/useSession';

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

describe('SessionDetailPage', () => {
  beforeEach(() => {
    vi.mocked(useSession).mockReturnValue({ session: null, loading: false, error: null });
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

  it('renders all key stats', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    renderPage();
    expect(screen.getByText('87')).toBeDefined();   // score
    expect(screen.getByText('12')).toBeDefined();   // goals
    expect(screen.getByText('15')).toBeDefined();   // streak
    expect(screen.getByText('200')).toBeDefined();  // balls
    expect(screen.getByText('3.4')).toBeDefined();  // avg speed
    expect(screen.getByText('6')).toBeDefined();    // exercises
  });

  it('renders a back link to /sessions', () => {
    vi.mocked(useSession).mockReturnValue({ session, loading: false, error: null });
    renderPage();
    const backLink = screen.getByRole('link', { name: /back/i });
    expect(backLink.getAttribute('href')).toBe('/sessions');
  });
});
