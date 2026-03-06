import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerProvider, usePlayerContext } from './PlayerContext';
import type { Profile } from '../../types';

// A minimal consumer component — lets us inspect context values via the DOM.
function TestConsumer(): React.ReactElement {
  const { email, profile, setEmail, setProfile, logout } = usePlayerContext();
  return (
    <div>
      <span data-testid="email">{email ?? 'none'}</span>
      <span data-testid="profile-name">{profile ? profile.firstName : 'none'}</span>
      <button onClick={() => setEmail('test@toca.com')}>Set Email</button>
      <button
        onClick={() =>
          setProfile({
            id: 'p1',
            email: 'test@toca.com',
            firstName: 'Jordan',
            lastName: 'Smith',
            phone: '555-0100',
            gender: 'Male',
            dob: '1998-05-12',
            centerName: 'TOCA West',
            createdAt: '2024-01-01T00:00:00Z',
          } satisfies Profile)
        }
      >
        Set Profile
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('PlayerProvider', () => {
  it('provides null email and null profile by default', () => {
    render(
      <PlayerProvider>
        <TestConsumer />
      </PlayerProvider>,
    );

    expect(screen.getByTestId('email').textContent).toBe('none');
    expect(screen.getByTestId('profile-name').textContent).toBe('none');
  });

  it('setEmail updates the email value in context', async () => {
    render(
      <PlayerProvider>
        <TestConsumer />
      </PlayerProvider>,
    );

    await userEvent.click(screen.getByText('Set Email'));

    expect(screen.getByTestId('email').textContent).toBe('test@toca.com');
  });

  it('setProfile updates the profile value in context', async () => {
    render(
      <PlayerProvider>
        <TestConsumer />
      </PlayerProvider>,
    );

    await userEvent.click(screen.getByText('Set Profile'));

    expect(screen.getByTestId('profile-name').textContent).toBe('Jordan');
  });

  it('logout clears both email and profile', async () => {
    render(
      <PlayerProvider>
        <TestConsumer />
      </PlayerProvider>,
    );

    await userEvent.click(screen.getByText('Set Email'));
    await userEvent.click(screen.getByText('Set Profile'));
    await userEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('email').textContent).toBe('none');
    expect(screen.getByTestId('profile-name').textContent).toBe('none');
  });
});

describe('usePlayerContext', () => {
  it('throws when used outside PlayerProvider', () => {
    // Suppress the expected console.error from React's error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<TestConsumer />)).toThrow(
      'usePlayerContext must be used inside <PlayerProvider>',
    );

    consoleSpy.mockRestore();
  });
});
