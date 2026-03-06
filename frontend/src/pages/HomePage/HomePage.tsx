import type { ReactElement } from 'react';
import { AppointmentList } from '../../components/AppointmentList';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SessionList } from '../../components/SessionList';
import { usePlayerContext } from '../../context/PlayerContext';
import { useAppointments } from '../../hooks/useAppointments';
import { useProfile } from '../../hooks/useProfile';
import { useSessions } from '../../hooks/useSessions';

export default function HomePage(): ReactElement {
  // useProfile is idempotent — if Layout already fetched the profile it's a no-op.
  const { loading: profileLoading, error: profileError } = useProfile();
  const { sessions, loading: sessionsLoading, error: sessionsError } = useSessions();
  const { appointments, loading: apptLoading, error: apptError } = useAppointments();
  const { profile } = usePlayerContext();

  const loading = profileLoading || sessionsLoading || apptLoading;
  const error = profileError ?? sessionsError ?? apptError;

  if (loading) return <LoadingSpinner label="Loading your dashboard" />;
  if (error !== null) return <ErrorMessage message={error} />;

  const upcomingCount = appointments.filter(a => new Date(a.startTime) > new Date()).length;

  return (
    <div className="space-y-10">
      {/* Welcome hero */}
      <div className="rounded-2xl bg-gradient-to-br from-toca-navy via-[#0a1a8a] to-[#120e90] px-10 py-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-toca-purple">
          Welcome back
        </p>
        <h1 className="font-poppins text-5xl font-bold text-white">
          {profile !== null ? profile.firstName : 'Player'}
        </h1>
      </div>

      {/* Training Sessions */}
      <section>
        <div className="mb-6 flex items-baseline gap-4">
          <h2 className="font-poppins text-2xl font-bold text-toca-navy">Training Sessions</h2>
          <span className="font-poppins text-4xl font-bold text-toca-purple">{sessions.length}</span>
        </div>
        <SessionList sessions={sessions} />
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className="mb-6 flex items-baseline gap-4">
          <h2 className="font-poppins text-2xl font-bold text-toca-navy">Upcoming Appointments</h2>
          <span className="font-poppins text-4xl font-bold text-toca-purple">{upcomingCount}</span>
        </div>
        <AppointmentList appointments={appointments} />
      </section>
    </div>
  );
}
