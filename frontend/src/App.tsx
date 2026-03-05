import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlayerProvider } from './context/PlayerContext';
import AppointmentsPage from './pages/AppointmentsPage';
import LoginPage from './pages/LoginPage';
import SessionDetailPage from './pages/SessionDetailPage';
import SessionListPage from './pages/SessionListPage';

export function App(): ReactElement {
  return (
    <PlayerProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/sessions" replace />} />
            <Route path="/sessions" element={<SessionListPage />} />
            <Route path="/sessions/:id" element={<SessionDetailPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
          </Route>
        </Route>
      </Routes>
    </PlayerProvider>
  );
}
