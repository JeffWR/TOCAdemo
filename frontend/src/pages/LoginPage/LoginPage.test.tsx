import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import LoginPage from './LoginPage';

function renderLoginPage(): void {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <PlayerProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sessions" element={<p>Sessions page</p>} />
        </Routes>
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('renders an email input', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeDefined();
  });

  it('renders a submit button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('disables submit when email input is empty', () => {
    renderLoginPage();
    const button = screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('navigates to /sessions after entering an email and submitting', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    await user.type(screen.getByLabelText(/email/i), 'player@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Sessions page')).toBeDefined();
  });

  it('does not navigate if the email input is blank', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.queryByText('Sessions page')).toBeNull();
  });
});
