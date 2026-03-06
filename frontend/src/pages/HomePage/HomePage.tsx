import type { ReactElement } from 'react';
import { AppointmentList } from '../../components/AppointmentList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SessionList } from '../../components/SessionList';
import { useAppointments } from '../../hooks/useAppointments';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

export default function HomePage(): ReactElement {
  const { loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments();

  const loading = profileLoading || sessionsLoading || apptLoading;
  const error = profileError ?? sessionsError ?? apptError;

  if (loading) return <LoadingSpinner label="Loading your dashboard" />;
  if (error !== null) return <ErrorMessage message={error} />;

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2 className="font-poppins mb-5 text-xl font-bold text-toca-navy">Training Sessions</h2>
        <SessionList sessions={sessions} />
      </section>
      <section>
        <h2 className="font-poppins mb-5 text-xl font-bold text-toca-navy">
          Upcoming Appointments
        </h2>
        <AppointmentList appointments={appointments} />
      </section>
    </div>
  );
}
