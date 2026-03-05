import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Appointment } from '../../types';
import { AppointmentCard } from './AppointmentCard';

const appointment: Appointment = {
  id: 'a1',
  playerId: 'p1',
  trainerName: 'Coach Sam',
  startTime: '2024-04-10T14:00:00Z',
  endTime: '2024-04-10T15:00:00Z',
};

describe('AppointmentCard', () => {
  it('renders trainer name', () => {
    render(<AppointmentCard appointment={appointment} />);
    expect(screen.getByText('Coach Sam')).toBeDefined();
  });

  it('renders the date', () => {
    render(<AppointmentCard appointment={appointment} />);
    // Apr 10, 2024 formatted
    expect(screen.getByText(/Apr 10/)).toBeDefined();
  });

  it('renders the "Upcoming" label', () => {
    render(<AppointmentCard appointment={appointment} />);
    expect(screen.getByText('Upcoming')).toBeDefined();
  });
});
