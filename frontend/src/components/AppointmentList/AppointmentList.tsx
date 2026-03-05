import type { ReactElement } from 'react';
import type { Appointment } from '../../types';
import { AppointmentCard } from '../AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps): ReactElement {
  if (appointments.length === 0) {
    return <p className="text-sm text-gray-500">No upcoming appointments.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {appointments.map((appointment) => (
        <li key={appointment.id}>
          <AppointmentCard appointment={appointment} />
        </li>
      ))}
    </ul>
  );
}
