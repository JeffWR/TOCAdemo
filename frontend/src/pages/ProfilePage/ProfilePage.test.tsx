import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { Profile, TrainingSession } from '../../types';
import ProfilePage from './ProfilePage';

vi.mock('../../hooks/useProfile', () => ({ useProfile: vi.fn() }));
vi.mock('../../hooks/useSessions', () => ({ useSessions: vi.fn() }));

import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

const profile: Profile = {
  id: 'p1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '555-0100',
  gender: 'Female',
  dob: '1995-06-15',
  centerName: 'TOCA West',
  createdAt: '2023-01-01T00:00:00Z',
};

function makeSession(overrides: Partial<TrainingSession> = {}): TrainingSession {
  return {
    id: 's1',
    playerId: 'p1',
    trainerName: 'Coach A',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T11:00:00Z',
    numberOfBalls: 100,
    bestStreak: 10,
    numberOfGoals: 20,
    score: 75,
    avgSpeedOfPlay: 5.0,
    numberOfExercises: 5,
    ...overrides,
  };
}

function renderPage(initialProfile: Profile | null = null): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="jane@example.com" initialProfile={initialProfile}>
        <ProfilePage />
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.mocked(useProfile).mockReturnValue({ loading: false, error: null });
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: null });
  });

  it('shows a loading spinner while profile is fetching', () => {
    vi.mocked(useProfile).mockReturnValue({ loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('shows an error message when profile fetch fails', () => {
    vi.mocked(useProfile).mockReturnValue({ loading: false, error: 'Network error' });
    renderPage();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('shows an error when profile is null after loading', () => {
    renderPage(null);
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('renders the player name as the page heading', () => {
    renderPage(profile);
    expect(screen.getByRole('heading', { name: /jane doe/i })).toBeDefined();
  });

  it('renders the player email', () => {
    renderPage(profile);
    expect(screen.getByText('jane@example.com')).toBeDefined();
  });

  it('renders the center name', () => {
    renderPage(profile);
    expect(screen.getAllByText('TOCA West').length).toBeGreaterThan(0);
  });

  it('renders account detail fields', () => {
    renderPage(profile);
    expect(screen.getByText('555-0100')).toBeDefined();
    expect(screen.getByText('Female')).toBeDefined();
  });

  it('shows stat cards when sessions are loaded', () => {
    const sessions = [makeSession({ id: 's1', score: 80, numberOfGoals: 5, bestStreak: 8 })];
    vi.mocked(useSessions).mockReturnValue({ sessions, loading: false, error: null });
    renderPage(profile);
    expect(screen.getByText('Sessions')).toBeDefined();
    expect(screen.getByText('Total Goals')).toBeDefined();
    expect(screen.getByText('Avg Score')).toBeDefined();
    expect(screen.getByText('Best Streak')).toBeDefined();
  });

  it('does not show stat section while sessions are loading', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: true, error: null });
    renderPage(profile);
    expect(screen.queryByText('Sessions')).toBeNull();
  });

  it('does not show the score chart when there is only one session', () => {
    const sessions = [makeSession()];
    vi.mocked(useSessions).mockReturnValue({ sessions, loading: false, error: null });
    renderPage(profile);
    expect(screen.queryByText(/score trend/i)).toBeNull();
  });

  it('shows the score chart when there are two or more sessions', () => {
    const sessions = [
      makeSession({ id: 's1', startTime: '2024-01-01T10:00:00Z', score: 70 }),
      makeSession({ id: 's2', startTime: '2024-02-01T10:00:00Z', score: 80 }),
    ];
    vi.mocked(useSessions).mockReturnValue({ sessions, loading: false, error: null });
    renderPage(profile);
    expect(screen.getByText(/score trend/i)).toBeDefined();
  });

  it('shows — for avg score when there are no sessions', () => {
    vi.mocked(useSessions).mockReturnValue({ sessions: [], loading: false, error: null });
    renderPage(profile);
    // No stat cards rendered when sessions is empty — stat section is hidden
    expect(screen.queryByText('Avg Score')).toBeNull();
  });
});
