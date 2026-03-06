import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { Profile } from '../../types';
import ProfilePage from './ProfilePage';

vi.mock('../../hooks/useProfile', () => ({ useProfile: vi.fn() }));

import { useProfile } from '../../hooks/useProfile';

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
  });

  it('shows a loading spinner while profile is fetching', () => {
    vi.mocked(useProfile).mockReturnValue({ loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('renders the player name as the page heading', () => {
    renderPage(profile);
    expect(screen.getByRole('heading', { name: /jane doe/i })).toBeDefined();
  });

  it('renders the player full name', () => {
    renderPage(profile);
    expect(screen.getByText(/Jane Doe/i)).toBeDefined();
  });

  it('renders the player email', () => {
    renderPage(profile);
    expect(screen.getByText('jane@example.com')).toBeDefined();
  });

  it('renders the center name', () => {
    renderPage(profile);
    expect(screen.getAllByText('TOCA West').length).toBeGreaterThan(0);
  });
});
