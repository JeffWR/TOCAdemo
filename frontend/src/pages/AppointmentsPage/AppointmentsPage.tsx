import type { ReactElement } from 'react';
import { AppointmentList } from '../../components/AppointmentList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAppointments } from '../../hooks/useAppointments';
import { useProfile } from '../../hooks/useProfile';

export default function AppointmentsPage(): ReactElement {
  const { loading: profileLoading, error: profileError } = useProfile();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments();

  const loading = profileLoading || apptLoading;
  const error = profileError ?? apptError;

  if (loading) return <LoadingSpinner label="Loading appointments" />;
  if (error !== null) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1 className="mb-4 text-xl font-bold text-gray-900">Appointments</h1>
      <AppointmentList appointments={appointments} />
    </section>
  );
}
