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
    ? 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500'
    : 'rounded-full bg-toca-purple/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-toca-navy';

  return (
    <div className="flex items-center justify-between rounded-xl border border-toca-navy/10 bg-white p-5 shadow-sm">
      <div>
        <p className="font-poppins text-sm font-semibold text-toca-navy">
          {appointment.trainerName}
        </p>
        <p className="text-xs text-gray-400 mt-1">{formatDateTime(appointment.startTime)}</p>
      </div>
      <span className={badgeClass}>{label}</span>
    </div>
  );
}
