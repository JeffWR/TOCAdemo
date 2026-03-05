import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerProvider } from '../../context/PlayerContext';
import type { Appointment } from '../../types';
import AppointmentsPage from './AppointmentsPage';

vi.mock('../../hooks/useProfile', () => ({ useProfile: () => ({ loading: false, error: null }) }));
vi.mock('../../hooks/useAppointments', () => ({
  useAppointments: vi.fn(),
}));

import { useAppointments } from '../../hooks/useAppointments';

const appointments: Appointment[] = [
  {
    id: 'a1',
    playerId: 'p1',
    trainerName: 'Coach Sam',
    startTime: '2099-04-10T14:00:00Z',
    endTime: '2099-04-10T15:00:00Z',
  },
];

function renderPage(): void {
  render(
    <MemoryRouter>
      <PlayerProvider initialEmail="player@example.com">
        <AppointmentsPage />
      </PlayerProvider>
    </MemoryRouter>,
  );
}

describe('AppointmentsPage', () => {
  beforeEach(() => {
    vi.mocked(useAppointments).mockReturnValue({ appointments: [], loading: false, error: null });
  });

  it('shows a loading spinner while fetching', () => {
    vi.mocked(useAppointments).mockReturnValue({ appointments: [], loading: true, error: null });
    renderPage();
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('shows an error message when fetch fails', () => {
    vi.mocked(useAppointments).mockReturnValue({ appointments: [], loading: false, error: 'Failed to load' });
    renderPage();
    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Failed to load')).toBeDefined();
  });

  it('renders an appointment list when data loads', () => {
    vi.mocked(useAppointments).mockReturnValue({ appointments, loading: false, error: null });
    renderPage();
    expect(screen.getByText('Coach Sam')).toBeDefined();
  });

  it('renders the page heading', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /appointments/i })).toBeDefined();
  });
});
