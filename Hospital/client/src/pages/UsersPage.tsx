import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

export default function UsersPage() {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<{ msg: string; sev: 'success' | 'error' } | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      setAllUsers(await listUsers());
    } catch {
      setToast({ msg: 'Failed to load users', sev: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

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

  function openAdd() {
    setEditing(null);
    setEmail('');
    setPassword('');
    setDialogOpen(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setEmail(u.email);
    setPassword('');
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!email.trim() || (!editing && !password.trim())) {
      setToast({ msg: 'Email and password are required', sev: 'error' });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateUser(editing._id, { email: email.trim(), password: password.trim() || undefined });
        setToast({ msg: 'User updated', sev: 'success' });
      } else {
        await createUser({ email: email.trim(), password: password.trim() });
        setToast({ msg: 'User added', sev: 'success' });
      }
      setDialogOpen(false);
      fetchRows();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { msg?: string } } })?.response?.data?.msg || 'Save failed';
      setToast({ msg, sev: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteUser(toDelete._id);
      setToast({ msg: `User “${toDelete.email}” deleted`, sev: 'success' });
      fetchRows();
    } catch {
      setToast({ msg: 'Delete failed', sev: 'error' });
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
      <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
        <IconButton
          aria-label="Back to dashboard"
          onClick={() => navigate('/admin')}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
            '&:hover': {
              bgcolor: 'primary.main',
              borderColor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Manage Users</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View every admin user below. Use the action icons on each row to edit or delete, or add a new one.
        Passwords are hashed and never displayed — use Edit to set a new one.
      </Typography>

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

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
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
          sx={{
            border: 'none',
            // Paint the navy background directly on the header strip + each header
            // cell (don't rely on the --DataGrid-containerBackground variable, which
            // this build leaves white), then force white title text on top.
            '--DataGrid-containerBackground': 'hsl(222,44%,8%)',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: 'hsl(222,44%,8%)' },
            '& .MuiDataGrid-columnHeader': { backgroundColor: 'hsl(222,44%,8%)', color: '#fff' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 600, color: '#fff' },
            '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton': {
              color: '#fff',
            },
          }}
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
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <Typography>Delete “{toDelete?.email}”? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.sev} onClose={() => setToast(null)} variant="filled">
            {toast.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
