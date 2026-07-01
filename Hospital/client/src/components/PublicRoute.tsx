import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../store/hooks';
import { roleHome } from '../lib/roles';

// Guest-only gate: the mirror of ProtectedRoute. Wraps the pages that only make
// sense when signed OUT (public landing, login, register). Once a user is
// authenticated they should never see these again, so we bounce them to their
// own role home. This also removes the "logged-in admin/doctor on the public
// landing page" dead-end — they can't reach that page to begin with.
export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Wait for session rehydration so a returning user doesn't see a flash of the
  // public page before being redirected.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return <>{children}</>;
}
