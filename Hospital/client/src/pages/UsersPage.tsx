import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
  type UserInput,
} from '../api/users';
import { getErrorMessage } from '../lib/errors';
import { ROLES, DEFAULT_ROLE, roleLabel } from '../lib/roles';
import { validateUser, type UserFormValues } from '../lib/validation';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { dataGridSx, dataGridWrapperSx } from '../components/dataGridStyles';

const EMPTY_FORM: UserFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: DEFAULT_ROLE,
};

// Joins the name parts into a single display string.
const fullName = (u: Pick<User, 'firstName' | 'middleName' | 'lastName'>) =>
  [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ');

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Add/Edit dialog state.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormValues>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false); // show field errors only after a save attempt
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState<User | null>(null);
  const { toast, showToast, hideToast } = useToast();

  // Load the full user list from the API.
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      setAllUsers(await listUsers());
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // The user list is small, so search is client-side over name/email/phone.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const rows = useMemo(() => {
    if (!search) return allUsers;
    return allUsers.filter(
      (u) =>
        fullName(u).toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.phone ?? '').includes(search)
    );
  }, [allUsers, search]);

  // Live field errors; only surfaced once the user has pressed Save.
  const errors = useMemo(() => validateUser(form, !!editing), [form, editing]);
  const setField = (key: keyof UserFormValues, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Open the dialog in "add" mode with empty fields.
  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setDialogOpen(true);
  }

  // Open the dialog in "edit" mode pre-filled from the row.
  function openEdit(u: User) {
    setEditing(u);
    setForm({
      firstName: u.firstName ?? '',
      middleName: u.middleName ?? '',
      lastName: u.lastName ?? '',
      email: u.email,
      phone: u.phone ?? '',
      password: '',
      role: u.role ?? DEFAULT_ROLE,
    });
    setSubmitted(false);
    setDialogOpen(true);
  }

  // Validate, then create or update the user and refresh the grid.
  async function handleSave() {
    setSubmitted(true);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      showToast(firstError, 'error');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const data: Partial<UserInput> = {
          firstName: form.firstName.trim(),
          middleName: form.middleName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
        };
        if (form.password.trim()) data.password = form.password.trim();
        await updateUser(editing._id, data);
        showToast('User updated', 'success');
      } else {
        await createUser({
          firstName: form.firstName.trim(),
          middleName: form.middleName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          password: form.password.trim(),
        });
        showToast('User added', 'success');
      }
      setDialogOpen(false);
      fetchRows();
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Save failed'), 'error');
    } finally {
      setSaving(false);
    }
  }

  // Delete the confirmed user, then refresh the grid.
  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteUser(toDelete._id);
      showToast(`User “${toDelete.email}” deleted`, 'success');
      fetchRows();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setToDelete(null);
    }
  }

  const columns = useMemo<GridColDef<User>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1.3,
        minWidth: 170,
        valueGetter: (_v, row) => fullName(row) || '—',
      },
      { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 130, valueFormatter: (v) => v || '—' },
      {
        field: 'role',
        headerName: 'Role',
        flex: 0.8,
        minWidth: 110,
        valueFormatter: (v) => roleLabel(v as string | undefined),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 110,
        getActions: (params) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon color="secondary" />}
            label="Edit"
            onClick={() => openEdit(params.row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={() => setToDelete(params.row)}
          />,
        ],
      },
    ],
    []
  );

  return (
    <Box>
      <PageHeader
        backTo="/admin"
        title="Manage Users"
        description="View every user below. Use the action icons on each row to edit or delete, or add a new one. Passwords are hashed and never displayed — use Edit to set a new one."
      />

      {/* Search box + Add button */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <TextField
          placeholder="Search by name, email or phone…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          sx={{ maxWidth: 360, width: '100%' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add User
        </Button>
      </Stack>

      {/* Users table */}
      <Box sx={dataGridWrapperSx}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r._id}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSorting
          autoHeight
          sx={dataGridSx}
        />
      </Box>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First name"
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
              error={submitted && !!errors.firstName}
              helperText={submitted ? errors.firstName : ''}
              fullWidth
              autoFocus
            />
            <TextField
              label="Middle name (optional)"
              value={form.middleName}
              onChange={(e) => setField('middleName', e.target.value)}
              error={submitted && !!errors.middleName}
              helperText={submitted ? errors.middleName : ''}
              fullWidth
            />
            <TextField
              label="Last name"
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
              error={submitted && !!errors.lastName}
              helperText={submitted ? errors.lastName : ''}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              error={submitted && !!errors.email}
              helperText={submitted ? errors.email : ''}
              fullWidth
            />
            <TextField
              label="Phone number"
              value={form.phone}
              // Accept digits only, capped at 10 — non-numeric input is dropped.
              onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={submitted && !!errors.phone}
              helperText={submitted ? errors.phone : '10 digits'}
              slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 10 } }}
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={(e) => setField('role', e.target.value)}
              error={submitted && !!errors.role}
              helperText={submitted ? errors.role : ''}
              fullWidth
            >
              {ROLES.map((r) => (
                <MenuItem key={r.code} value={r.code}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={editing ? 'New password (leave blank to keep)' : 'Password'}
              type="text"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              error={submitted && !!errors.password}
              helperText={submitted ? errors.password : ''}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete user?"
        message={`Delete “${toDelete?.email}”? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
