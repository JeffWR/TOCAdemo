import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePlayerContext } from '../../context/PlayerContext';

export function ProtectedRoute(): ReactElement {
  const { email } = usePlayerContext();

  if (email === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
