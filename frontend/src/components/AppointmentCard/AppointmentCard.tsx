import type { ReactElement } from 'react';
import type { Appointment } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps): ReactElement {
  const isPast = new Date(appointment.startTime) < new Date();
  const label = isPast ? 'Completed' : 'Upcoming';
  const badgeClass = isPast
    ? 'rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'
    : 'rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700';

  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">{appointment.trainerName}</p>
        <p className="text-xs text-gray-500 mt-1">{formatDateTime(appointment.startTime)}</p>
      </div>
      <span className={badgeClass}>{label}</span>
    </div>
  );
}
