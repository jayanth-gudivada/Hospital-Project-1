import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import UsersPage from './pages/UsersPage';
import DoctorHomePage from './pages/DoctorHomePage';
import PatientHomePage from './pages/PatientHomePage';
import { getToken } from './api/client';
import { useAppDispatch } from './store/hooks';
import { loadSession } from './store/authSlice';
import { ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT } from './lib/roles';

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

      {/* Admin area (admins only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={[ROLE_ADMIN]}>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hospitals"
        element={
          <ProtectedRoute allow={[ROLE_ADMIN]}>
            <Layout>
              <HospitalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allow={[ROLE_ADMIN]}>
            <Layout>
              <UsersPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Doctor area (doctors only) */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allow={[ROLE_DOCTOR]}>
            <Layout>
              <DoctorHomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Patient area (patients only) */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allow={[ROLE_PATIENT]}>
            <Layout>
              <PatientHomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
