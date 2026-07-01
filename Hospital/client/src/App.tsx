import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import UsersPage from './pages/UsersPage';
import DoctorHomePage from './pages/DoctorHomePage';
import PatientHomePage from './pages/PatientHomePage';
import PatientProfilePage from './pages/PatientProfilePage';
import PatientLocationsPage from './pages/PatientLocationsPage';
import ConsultPage from './pages/ConsultPage';
import PatientLayout from './components/patient/PatientLayout';
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
      {/* Guest-only pages — signed-in users are bounced to their role home */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <PublicHomePage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

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

      {/* Patient area (patients only) — uses its own sidebar dashboard shell */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allow={[ROLE_PATIENT]}>
            <PatientLayout>
              <PatientHomePage />
            </PatientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allow={[ROLE_PATIENT]}>
            <PatientLayout>
              <PatientProfilePage />
            </PatientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/locations"
        element={
          <ProtectedRoute allow={[ROLE_PATIENT]}>
            <PatientLayout>
              <PatientLocationsPage />
            </PatientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/consult/:hospitalId"
        element={
          <ProtectedRoute allow={[ROLE_PATIENT]}>
            <PatientLayout>
              <ConsultPage />
            </PatientLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
