import { type ReactNode } from 'react';
import { AppBar, Toolbar, Box, Button, Container, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import ThemeToggle from './ThemeToggle';

// Shared admin chrome: dark top bar with the Doclab logo + Logout.
export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate('/', { replace: true });
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'hsl(222, 44%, 8%)' }}>
        <Toolbar>
          <Box component={RouterLink} to="/admin" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box component="img" src="/logo.svg" alt="Doclab" sx={{ height: 34 }} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ThemeToggle />
            <Button color="inherit" component={RouterLink} to="/admin">
              Dashboard
            </Button>
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
