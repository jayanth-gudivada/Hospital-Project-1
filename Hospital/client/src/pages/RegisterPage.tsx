import { useMemo, useState, type FormEvent } from 'react';
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
import { register } from '../store/authSlice';
import ThemeToggle from '../components/ThemeToggle';
import { roleHome, ROLE_PATIENT } from '../lib/roles';
import { validateUser, type UserFormValues } from '../lib/validation';
import { takePostLoginRedirect } from '../lib/postLoginRedirect';

// Public self-service signup — collects the same details the admin form does, minus
// the role picker: every account created here is a patient (enforced server-side too).
const EMPTY_FORM: UserFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: ROLE_PATIENT,
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserFormValues>(EMPTY_FORM);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false); // reveal field errors only after a submit
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live validation reuses the same rules as the admin Add-User form (create mode).
  const errors = useMemo(() => validateUser(form, false), [form]);
  const setField = (key: keyof UserFormValues, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Confirm-password is signup-only, so it lives here rather than in the shared rules.
  const confirmError = useMemo(() => {
    if (!confirmPassword.trim()) return 'Please confirm your password';
    if (confirmPassword !== form.password) return 'Passwords do not match';
    return '';
  }, [confirmPassword, form.password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError('');

    const firstError = Object.values(errors)[0] || confirmError;
    if (firstError) {
      setError(firstError);
      return;
    }

    setSubmitting(true);
    try {
      // Auto-logs in on success, so send the new patient straight to their dashboard.
      const user = await dispatch(
        register({
          firstName: form.firstName.trim(),
          middleName: form.middleName.trim() || undefined,
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password.trim(),
        })
      ).unwrap();
      // A new account is always a patient, so honour a pending gated route (e.g.
      // "Consult now") if one was stashed before signup; otherwise the dashboard.
      const redirect = takePostLoginRedirect();
      navigate(redirect || roleHome(user.role), { replace: true });
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Registration failed. Please try again.');
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
      <Paper elevation={6} sx={{ p: { xs: 2.5, sm: 3 }, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Stack spacing={0.5} sx={{ mb: 2.5, alignItems: 'center' }}>
          <Typography variant="h6">Create your account</Typography>
          <Typography variant="caption" color="text.secondary">
            Sign up as a patient to book and track your care
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={1.75}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75}>
              <TextField
                label="First name"
                size="small"
                value={form.firstName}
                onChange={(e) => setField('firstName', e.target.value)}
                error={submitted && !!errors.firstName}
                helperText={submitted ? errors.firstName : ''}
                fullWidth
                autoFocus
              />
              <TextField
                label="Last name"
                size="small"
                value={form.lastName}
                onChange={(e) => setField('lastName', e.target.value)}
                error={submitted && !!errors.lastName}
                helperText={submitted ? errors.lastName : ''}
                fullWidth
              />
            </Stack>
            <TextField
              label="Middle name (optional)"
              size="small"
              value={form.middleName}
              onChange={(e) => setField('middleName', e.target.value)}
              error={submitted && !!errors.middleName}
              helperText={submitted ? errors.middleName : ''}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              size="small"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={submitted && !!errors.email}
              helperText={submitted ? errors.email : ''}
              fullWidth
            />
            <TextField
              label="Phone number"
              size="small"
              value={form.phone}
              // Accept digits only, capped at 10 — non-numeric input is dropped.
              onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={submitted && !!errors.phone}
              helperText={submitted ? errors.phone : '10 digits'}
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              size="small"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              error={submitted && !!errors.password}
              helperText={submitted ? errors.password : ''}
              fullWidth
            />
            <TextField
              label="Confirm password"
              type="password"
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={submitted && !!confirmError}
              helperText={submitted ? confirmError : ''}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
