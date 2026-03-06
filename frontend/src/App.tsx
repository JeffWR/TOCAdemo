import type { ReactElement } from 'react';
import { SESSION_EMAIL_KEY } from './context/PlayerContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PlayerProvider } from './context/PlayerContext';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SessionDetailPage from './pages/SessionDetailPage';

export function App(): ReactElement {
  const savedEmail = sessionStorage.getItem(SESSION_EMAIL_KEY);
  return (
    <PlayerProvider initialEmail={savedEmail}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sessions/:id" element={<SessionDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PlayerProvider>
  );
}
