import type { ReactElement } from 'react';
import { AppointmentList } from '../../components/AppointmentList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SessionList } from '../../components/SessionList';
import { useAppointments } from '../../hooks/useAppointments';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

export default function HomePage(): ReactElement {
  // useProfile is idempotent — if Layout already fetched the profile it's a no-op.
  const { loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments();

  const loading = profileLoading || sessionsLoading || apptLoading;
  const error = profileError ?? sessionsError ?? apptError;

  if (loading) return <LoadingSpinner label="Loading your dashboard" />;
  if (error !== null) return <ErrorMessage message={error} />;

  const upcomingCount = appointments.filter(a => new Date(a.startTime) > new Date()).length;

  return (
    <div className="space-y-10">
      {/* Training Sessions */}
      <section>
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-poppins text-2xl font-bold text-toca-navy">Training Sessions</h2>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-toca-navy font-poppins text-sm font-bold text-white">
            {sessions.length}
          </span>
        </div>
        <SessionList sessions={sessions} />
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className="mb-6 flex items-center gap-4">
          <h2 className="font-poppins text-2xl font-bold text-toca-navy">Upcoming Appointments</h2>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-toca-navy font-poppins text-sm font-bold text-white">
            {upcomingCount}
          </span>
        </div>
        <AppointmentList appointments={appointments} />
      </section>
    </div>
  );
}
