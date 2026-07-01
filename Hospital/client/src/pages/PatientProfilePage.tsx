import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Skeleton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProfile, updateProfile, type FamilyMember } from '../api/patient';
import { getErrorMessage } from '../lib/errors';
import { GENDERS, genderLabel } from '../lib/genders';
import { RELATIONS, relationLabel } from '../lib/relations';
import {
  validateProfile,
  validateFamilyMember,
  type ProfileFormValues,
  type FamilyFormValues,
} from '../lib/validation';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { useAppDispatch } from '../store/hooks';
import { markProfileFilled } from '../store/authSlice';

// A family row in local state carries a stable React key on top of the API shape.
type FamilyRow = FamilyMember & { _key: string };

const EMPTY_PROFILE: ProfileFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
};

const EMPTY_FAMILY: FamilyFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  gender: '',
  address: '',
  relation: '',
};

// The server stores dates as full ISO strings; the <input type="date"> wants "YYYY-MM-DD".
const isoToDateInput = (iso: string) => (iso ? iso.slice(0, 10) : '');
const fullName = (p: { firstName: string; middleName: string; lastName: string }) =>
  [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ');

export default function PatientProfilePage() {
  const { toast, showToast, hideToast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Screen-level load state (fetch on mount, retry on failure).
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState<ProfileFormValues>(EMPTY_PROFILE);
  const [rows, setRows] = useState<FamilyRow[]>([]);
  const [submitted, setSubmitted] = useState(false); // reveal profile errors only after a save attempt
  const [submitting, setSubmitting] = useState(false); // guards the single final submit

  // Add/Edit family dialog.
  const [familyOpen, setFamilyOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [familyForm, setFamilyForm] = useState<FamilyFormValues>(EMPTY_FAMILY);
  const [familySubmitted, setFamilySubmitted] = useState(false);

  // Local key generator for freshly-added family rows (server rows key off their Id).
  const keySeq = useRef(0);
  const nextKey = () => `new-${keySeq.current++}`;

  const hydrate = useCallback((profile: ProfileFormValues, family: FamilyMember[]) => {
    setForm(profile);
    setRows(family.map((m) => ({ ...m, _key: m.Id != null ? `srv-${m.Id}` : nextKey() })));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { profile, family } = await getProfile();
      hydrate(
        {
          firstName: profile.firstName ?? '',
          middleName: profile.middleName ?? '',
          lastName: profile.lastName ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
          dateOfBirth: isoToDateInput(profile.dateOfBirth ?? ''),
          gender: profile.gender ?? '',
          address: profile.address ?? '',
        },
        family.map((m) => ({ ...m, dateOfBirth: isoToDateInput(m.dateOfBirth) }))
      );
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Could not load your profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, [hydrate]);

  useEffect(() => {
    load();
  }, [load]);

  // Live profile errors; only surfaced once the user has pressed Save.
  const errors = useMemo(() => validateProfile(form), [form]);
  const setField = (key: keyof ProfileFormValues, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const familyErrors = useMemo(() => validateFamilyMember(familyForm), [familyForm]);
  const setFamilyField = (key: keyof FamilyFormValues, value: string) =>
    setFamilyForm((f) => ({ ...f, [key]: value }));

  function openAddFamily() {
    setEditingKey(null);
    setFamilyForm(EMPTY_FAMILY);
    setFamilySubmitted(false);
    setFamilyOpen(true);
  }

  function openEditFamily(row: FamilyRow) {
    setEditingKey(row._key);
    setFamilyForm({
      firstName: row.firstName,
      middleName: row.middleName,
      lastName: row.lastName,
      email: row.email,
      dateOfBirth: row.dateOfBirth,
      phone: row.phone,
      gender: row.gender,
      address: row.address,
      relation: row.relation,
    });
    setFamilySubmitted(false);
    setFamilyOpen(true);
  }

  // Commit the dialog into the in-memory table (nothing hits the API until final Save).
  function saveFamily() {
    setFamilySubmitted(true);
    const firstError = Object.values(familyErrors)[0];
    if (firstError) {
      showToast(firstError, 'error');
      return;
    }
    const member: FamilyMember = {
      firstName: familyForm.firstName.trim(),
      middleName: familyForm.middleName.trim(),
      lastName: familyForm.lastName.trim(),
      email: familyForm.email.trim(),
      dateOfBirth: familyForm.dateOfBirth,
      phone: familyForm.phone.trim(),
      gender: familyForm.gender,
      address: familyForm.address.trim(),
      relation: familyForm.relation,
    };

    setRows((prev) => {
      if (editingKey) {
        // Preserve the existing row's Id so the server updates rather than re-inserts.
        return prev.map((r) => (r._key === editingKey ? { ...r, ...member } : r));
      }
      return [...prev, { ...member, _key: nextKey() }];
    });
    setFamilyOpen(false);
  }

  function removeFamily(key: string) {
    setRows((prev) => prev.filter((r) => r._key !== key));
  }

  // The one, robust submit: disabled + guarded so it can't fire twice concurrently.
  async function handleSave() {
    if (submitting) return;
    setSubmitted(true);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      showToast(firstError, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { profile, family } = await updateProfile({
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address.trim(),
        // Strip the local React key before sending; Id (if any) drives update vs insert.
        family: rows.map(({ _key, ...m }) => m),
      });
      // Re-sync from the server so new rows pick up their assigned Ids.
      hydrate(
        {
          firstName: profile.firstName ?? '',
          middleName: profile.middleName ?? '',
          lastName: profile.lastName ?? '',
          email: profile.email ?? '',
          phone: profile.phone ?? '',
          dateOfBirth: isoToDateInput(profile.dateOfBirth ?? ''),
          gender: profile.gender ?? '',
          address: profile.address ?? '',
        },
        family.map((m) => ({ ...m, dateOfBirth: isoToDateInput(m.dateOfBirth) }))
      );
      // Clear the completion gate so the "complete your profile" prompt stops showing.
      dispatch(markProfileFilled());
      setSubmitted(false);
      showToast('Profile saved', 'success');
      // Land the user back on the dashboard now that their profile is complete.
      navigate('/patient');
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not save. Please try again.'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width={320} />
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mt: 2, borderRadius: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={40} />
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
          {loadError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>My Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Keep your personal details up to date and manage the people in your care.
        </Typography>
      </Stack>

      {/* ----- Personal details ----- */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Personal details</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="First name"
            size="small"
            value={form.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            error={submitted && !!errors.firstName}
            helperText={submitted ? errors.firstName : ''}
            fullWidth
          />
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
            label="Last name"
            size="small"
            value={form.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            error={submitted && !!errors.lastName}
            helperText={submitted ? errors.lastName : ''}
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
            label="Date of birth"
            type="date"
            size="small"
            value={form.dateOfBirth}
            onChange={(e) => setField('dateOfBirth', e.target.value)}
            error={submitted && !!errors.dateOfBirth}
            helperText={submitted ? errors.dateOfBirth : ''}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            label="Mobile number"
            size="small"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            error={submitted && !!errors.phone}
            helperText={submitted ? errors.phone : '10 digits'}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
            fullWidth
          />
          <TextField
            select
            label="Gender"
            size="small"
            value={form.gender}
            onChange={(e) => setField('gender', e.target.value)}
            error={submitted && !!errors.gender}
            helperText={submitted ? errors.gender : ''}
            fullWidth
          >
            <MenuItem value="">
              <em>Not specified</em>
            </MenuItem>
            {GENDERS.map((g) => (
              <MenuItem key={g.code} value={g.code}>{g.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Address"
            size="small"
            value={form.address}
            onChange={(e) => setField('address', e.target.value)}
            fullWidth
            multiline
            minRows={1}
          />
        </Box>
      </Paper>

      {/* ----- Family / dependants ----- */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>People in your care</Typography>
            <Typography variant="caption" color="text.secondary">
              Add family members and their relation to you. Changes save when you press Save changes.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={openAddFamily} sx={{ flexShrink: 0 }}>
            Add People
          </Button>
        </Stack>

        {rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No people added yet.
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 520 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Relation</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row._key} hover>
                    <TableCell>{fullName(row) || '—'}</TableCell>
                    <TableCell>{relationLabel(row.relation)}</TableCell>
                    <TableCell>{row.gender ? genderLabel(row.gender) : '—'}</TableCell>
                    <TableCell>{row.phone || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditFamily(row)}>
                          <EditIcon fontSize="small" color="secondary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton size="small" onClick={() => removeFamily(row._key)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      {/* ----- Single final submit ----- */}
      <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={handleSave} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>

      {/* Add / Edit family dialog */}
      <Dialog open={familyOpen} onClose={() => setFamilyOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingKey ? 'Edit person' : 'Add person'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              label="First name"
              size="small"
              value={familyForm.firstName}
              onChange={(e) => setFamilyField('firstName', e.target.value)}
              error={familySubmitted && !!familyErrors.firstName}
              helperText={familySubmitted ? familyErrors.firstName : ''}
              fullWidth
              autoFocus
            />
            <TextField
              label="Middle name (optional)"
              size="small"
              value={familyForm.middleName}
              onChange={(e) => setFamilyField('middleName', e.target.value)}
              error={familySubmitted && !!familyErrors.middleName}
              helperText={familySubmitted ? familyErrors.middleName : ''}
              fullWidth
            />
            <TextField
              label="Last name"
              size="small"
              value={familyForm.lastName}
              onChange={(e) => setFamilyField('lastName', e.target.value)}
              error={familySubmitted && !!familyErrors.lastName}
              helperText={familySubmitted ? familyErrors.lastName : ''}
              fullWidth
            />
            <TextField
              select
              label="Relation"
              size="small"
              value={familyForm.relation}
              onChange={(e) => setFamilyField('relation', e.target.value)}
              error={familySubmitted && !!familyErrors.relation}
              helperText={familySubmitted ? familyErrors.relation : ''}
              fullWidth
            >
              {RELATIONS.map((r) => (
                <MenuItem key={r.code} value={r.code}>{r.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Email (optional)"
              type="email"
              size="small"
              value={familyForm.email}
              onChange={(e) => setFamilyField('email', e.target.value)}
              error={familySubmitted && !!familyErrors.email}
              helperText={familySubmitted ? familyErrors.email : ''}
              fullWidth
            />
            <TextField
              label="Date of birth (optional)"
              type="date"
              size="small"
              value={familyForm.dateOfBirth}
              onChange={(e) => setFamilyField('dateOfBirth', e.target.value)}
              error={familySubmitted && !!familyErrors.dateOfBirth}
              helperText={familySubmitted ? familyErrors.dateOfBirth : ''}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Mobile number (optional)"
              size="small"
              value={familyForm.phone}
              onChange={(e) => setFamilyField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={familySubmitted && !!familyErrors.phone}
              helperText={familySubmitted ? familyErrors.phone : ''}
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
              fullWidth
            />
            <TextField
              select
              label="Gender (optional)"
              size="small"
              value={familyForm.gender}
              onChange={(e) => setFamilyField('gender', e.target.value)}
              error={familySubmitted && !!familyErrors.gender}
              helperText={familySubmitted ? familyErrors.gender : ''}
              fullWidth
            >
              <MenuItem value="">
                <em>Not specified</em>
              </MenuItem>
              {GENDERS.map((g) => (
                <MenuItem key={g.code} value={g.code}>{g.label}</MenuItem>
              ))}
            </TextField>
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <TextField
                label="Address (optional)"
                size="small"
                value={familyForm.address}
                onChange={(e) => setFamilyField('address', e.target.value)}
                fullWidth
                multiline
                minRows={1}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFamilyOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveFamily}>{editingKey ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
