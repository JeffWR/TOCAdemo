import type { ReactElement } from 'react';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePlayerContext } from '../../context/PlayerContext';
import { useProfile } from '../../hooks/useProfile';
import { formatDate } from '../../utils/formatters';

function Row({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function ProfilePage(): ReactElement {
  const { loading, error } = useProfile();
  const { profile } = usePlayerContext();

  if (loading) return <LoadingSpinner label="Loading profile" />;
  if (error !== null) return <ErrorMessage message={error} />;
  if (profile === null) return <ErrorMessage message="Profile not available" />;

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-2 shadow-sm">
        <Row label="Name" value={`${profile.firstName} ${profile.lastName}`} />
        <Row label="Email" value={profile.email} />
        <Row label="Phone" value={profile.phone} />
        <Row label="Date of Birth" value={formatDate(profile.dob)} />
        <Row label="Gender" value={profile.gender} />
        <Row label="Training Center" value={profile.centerName} />
        <Row label="Member Since" value={formatDate(profile.createdAt)} />
      </div>
    </div>
  );
}
