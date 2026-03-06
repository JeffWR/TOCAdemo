import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { Profile } from '../../types';
import { Header } from './Header';

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

function renderHeader(initialProfile: Profile | null = null): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="jane@example.com" initialProfile={initialProfile}>
        <Header />
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('renders the TOCA brand name', () => {
    renderHeader();
    expect(screen.getByText('TOCA')).toBeDefined();
  });

  it('renders the nav menu when logged in', () => {
    renderHeader();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeDefined();
  });

  it('does not render the nav menu when logged out', () => {
    render(
      <MemoryRouter>
        <PlayerProvider>
          <Header />
        </PlayerProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('navigation', { name: /main navigation/i })).toBeNull();
  });

  it('renders the player first name when profile is loaded', () => {
    renderHeader(profile);
    expect(screen.getByText(/Jane/)).toBeDefined();
  });

  it('renders a logout button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /log out/i })).toBeDefined();
  });

  it('does not render the logout button when no email is in context', () => {
    render(
      <MemoryRouter>
        <PlayerProvider>
          <Header />
        </PlayerProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /log out/i })).toBeNull();
  });

  it('calls logout handler when logout button is clicked', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    render(
      <MemoryRouter>
        <PlayerProvider initialEmail="jane@example.com">
          <Header onLogout={onLogout} />
        </PlayerProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /log out/i }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
