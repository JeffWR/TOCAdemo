import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Appointment } from '../../types';
import { AppointmentCard } from './AppointmentCard';

const futureAppointment: Appointment = {
  id: 'a1',
  playerId: 'p1',
  trainerName: 'Coach Sam',
  startTime: '2099-04-10T14:00:00Z',
  endTime: '2099-04-10T15:00:00Z',
};

const pastAppointment: Appointment = {
  id: 'a2',
  playerId: 'p1',
  trainerName: 'Coach Sam',
  startTime: '2020-04-10T14:00:00Z',
  endTime: '2020-04-10T15:00:00Z',
};

describe('AppointmentCard', () => {
  it('renders trainer name', () => {
    render(<AppointmentCard appointment={futureAppointment} />);
    expect(screen.getByText('Coach Sam')).toBeDefined();
  });

  it('renders the formatted date including year', () => {
    render(<AppointmentCard appointment={futureAppointment} />);
    expect(screen.getByText(/Apr 10, 2099/)).toBeDefined();
  });

  it('renders "Upcoming" for a future appointment', () => {
    render(<AppointmentCard appointment={futureAppointment} />);
    expect(screen.getByText('Upcoming')).toBeDefined();
  });

  it('renders "Completed" for a past appointment', () => {
    render(<AppointmentCard appointment={pastAppointment} />);
    expect(screen.getByText('Completed')).toBeDefined();
  });
});
