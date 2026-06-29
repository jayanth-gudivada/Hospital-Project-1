import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../store/hooks';
import { effectiveRole, roleHome } from '../lib/roles';

// Gates protected pages: shows a spinner while validating, sends signed-out users
// to the public home, and bounces users to their own area when their role isn't allowed.
export default function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: string[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allow && !allow.includes(effectiveRole(user.role))) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return <>{children}</>;
}
