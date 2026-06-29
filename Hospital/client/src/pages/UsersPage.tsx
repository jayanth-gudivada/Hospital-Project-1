import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Stack,
  TextField,
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
} from '../api/users';
import { getErrorMessage } from '../lib/errors';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { dataGridSx, dataGridWrapperSx } from '../components/dataGridStyles';

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Add/Edit dialog state.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  // The user list is small, so search/pagination are client-side here.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const rows = useMemo(
    () => (search ? allUsers.filter((u) => u.email.toLowerCase().includes(search)) : allUsers),
    [allUsers, search]
  );

  // Open the dialog in "add" mode with empty fields.
  function openAdd() {
    setEditing(null);
    setEmail('');
    setPassword('');
    setDialogOpen(true);
  }

  // Open the dialog in "edit" mode pre-filled with the row's email.
  function openEdit(u: User) {
    setEditing(u);
    setEmail(u.email);
    setPassword('');
    setDialogOpen(true);
  }

  // Create or update the user, then refresh the grid.
  async function handleSave() {
    if (!email.trim() || (!editing && !password.trim())) {
      showToast('Email and password are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateUser(editing._id, { email: email.trim(), password: password.trim() || undefined });
        showToast('User updated', 'success');
      } else {
        await createUser({ email: email.trim(), password: password.trim() });
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
      { field: 'email', headerName: 'Username', flex: 1.6, minWidth: 220 },
      {
        field: 'createdAt',
        headerName: 'Created',
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => (value ? new Date(value as string).toLocaleDateString() : '—'),
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

  // Enable Save only when the form is valid AND something actually changed,
  // so a no-op Edit can't fire an empty update.
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const canSave = editing
    ? !!trimmedEmail && (trimmedEmail !== editing.email || trimmedPassword.length > 0)
    : !!trimmedEmail && !!trimmedPassword;

  return (
    <Box>
      <PageHeader
        backTo="/admin"
        title="Manage Users"
        description="View every admin user below. Use the action icons on each row to edit or delete, or add a new one. Passwords are hashed and never displayed — use Edit to set a new one."
      />

      {/* Search box + Add button */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <TextField
          placeholder="Search by username…"
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
              label="Username (email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label={editing ? 'New password (leave blank to keep)' : 'Password'}
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !canSave}>
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
