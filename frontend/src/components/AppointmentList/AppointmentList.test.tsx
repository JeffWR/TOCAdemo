import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Appointment } from '../../types';
import { AppointmentList } from './AppointmentList';

const appointments: Appointment[] = [
  {
    id: 'a1',
    playerId: 'p1',
    trainerName: 'Coach Sam',
    startTime: '2024-04-10T14:00:00Z',
    endTime: '2024-04-10T15:00:00Z',
  },
  {
    id: 'a2',
    playerId: 'p1',
    trainerName: 'Coach Taylor',
    startTime: '2024-04-15T10:00:00Z',
    endTime: '2024-04-15T11:00:00Z',
  },
];

describe('AppointmentList', () => {
  it('renders a card for each appointment', () => {
    render(<AppointmentList appointments={appointments} />);
    expect(screen.getByText('Coach Sam')).toBeDefined();
    expect(screen.getByText('Coach Taylor')).toBeDefined();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('shows empty state message when appointments array is empty', () => {
    render(<AppointmentList appointments={[]} />);
    expect(screen.getByText('No upcoming appointments.')).toBeDefined();
  });
});
