import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicHomePage from './pages/PublicHomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import UsersPage from './pages/UsersPage';

export default function App() {
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
