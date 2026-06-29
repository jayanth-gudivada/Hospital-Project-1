import { type ReactNode } from 'react';
import { AppBar, Toolbar, Box, Button, Container, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAuth } from '../store/hooks';
import { logout } from '../store/authSlice';
import { ROLE_ADMIN, effectiveRole, roleHome } from '../lib/roles';
import ThemeToggle from './ThemeToggle';

// Shared signed-in chrome: dark top bar with the Doclab logo + Logout.
export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  // The logo links to the current user's own area; only admins see "Dashboard".
  const home = roleHome(user?.role);
  const isAdmin = effectiveRole(user?.role) === ROLE_ADMIN;

  function handleLogout() {
    dispatch(logout());
    navigate('/', { replace: true });
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'hsl(222, 44%, 8%)' }}>
        <Toolbar>
          <Box component={RouterLink} to={home} sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box component="img" src="/logo.svg" alt="Doclab" sx={{ height: 34 }} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ThemeToggle />
            {isAdmin && (
              <Button color="inherit" component={RouterLink} to="/admin">
                Dashboard
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
