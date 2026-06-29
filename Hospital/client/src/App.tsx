import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import UsersPage from './pages/UsersPage';
import { getToken } from './api/client';
import { useAppDispatch } from './store/hooks';
import { loadSession } from './store/authSlice';

export default function App() {
  const dispatch = useAppDispatch();

  // On first load, rehydrate the user from an existing token so the store
  // persists across page refreshes within the login session.
  useEffect(() => {
    if (getToken()) dispatch(loadSession());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public patient-facing site */}
      <Route path="/" element={<PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin area (JWT-protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hospitals"
        element={
          <ProtectedRoute>
            <Layout>
              <HospitalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UsersPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
