import { useState, type FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Divider,
  Link,
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import ThemeToggle from '../components/ThemeToggle';
import { roleHome, ROLE_PATIENT, effectiveRole } from '../lib/roles';
import { takePostLoginRedirect } from '../lib/postLoginRedirect';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await dispatch(login({ email: email.trim(), password })).unwrap();
      // If a gated action sent them here (e.g. "Consult now"), return them to it —
      // but only patients can reach that page, so ignore it for other roles.
      const redirect = takePostLoginRedirect();
      if (redirect && effectiveRole(user.role) === ROLE_PATIENT) {
        navigate(redirect, { replace: true });
      } else {
        // Otherwise send each user to their role's area (admin / doctor / patient).
        navigate(roleHome(user.role), { replace: true });
      }
    } catch (err: unknown) {
      // The thunk rejects with the server message (a string) via rejectWithValue.
      setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, hsl(222,44%,8%) 0%, hsl(186,72%,24%) 100%)',
      }}
    >
      {/* Theme toggle floats over the gradient (white on the dark backdrop). */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, color: '#fff' }}>
        <ThemeToggle />
      </Box>
      <Paper elevation={6} sx={{ p: { xs: 2.5, sm: 3 }, width: '100%', maxWidth: 360, borderRadius: 3 }}>
        <Stack spacing={0.5} sx={{ mb: 2.5, alignItems: 'center' }}>
          <Typography variant="h6">Welcome back</Typography>
          <Typography variant="caption" color="text.secondary">
            Sign in to your Doclab account
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={1.75}>
            <TextField
              label="Email"
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          New to Doclab?{' '}
          <Link component={RouterLink} to="/register" underline="hover">
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
