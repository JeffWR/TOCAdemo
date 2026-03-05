import React from 'react';
import type { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AppointmentCard({ appointment }: AppointmentCardProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">{appointment.trainerName}</p>
        <p className="text-xs text-gray-500 mt-1">{formatDateTime(appointment.startTime)}</p>
      </div>
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
        Upcoming
      </span>
    </div>
  );
}
