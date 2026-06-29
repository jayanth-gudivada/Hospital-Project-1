import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import ThemeToggle from '../components/ThemeToggle';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await dispatch(login({ email: email.trim(), password })).unwrap();
      navigate(from, { replace: true });
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
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Stack spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="h5">Admin Login</Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to manage Doclab
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
