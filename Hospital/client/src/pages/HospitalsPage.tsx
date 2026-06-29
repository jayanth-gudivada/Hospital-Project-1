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
  type GridPaginationModel,
} from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  listHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  type Hospital,
  type HospitalInput,
} from '../api/hospitals';

const EMPTY: HospitalInput = { name: '', location: '', address: '' };

export default function HospitalsPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<Hospital[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [form, setForm] = useState<HospitalInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  // delete confirm state
  const [toDelete, setToDelete] = useState<Hospital | null>(null);

  const [toast, setToast] = useState<{ msg: string; sev: 'success' | 'error' } | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listHospitals({
        search,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      setRows(res.items);
      setRowCount(res.total);
    } catch {
      setToast({ msg: 'Failed to load hospitals', sev: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, paginationModel]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Debounce search → resets to first page.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPaginationModel((m) => ({ ...m, page: 0 }));
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  function openEdit(h: Hospital) {
    setEditing(h);
    setForm({ name: h.name, location: h.location, address: h.address });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.location.trim() || !form.address.trim()) {
      setToast({ msg: 'Please fill all fields', sev: 'error' });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateHospital(editing._id, form);
        setToast({ msg: 'Hospital updated', sev: 'success' });
      } else {
        await createHospital(form);
        setToast({ msg: 'Hospital added', sev: 'success' });
      }
      setDialogOpen(false);
      fetchRows();
    } catch {
      setToast({ msg: 'Save failed', sev: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteHospital(toDelete._id);
      setToast({ msg: `Hospital “${toDelete.name}” deleted`, sev: 'success' });
      // If we just removed the last row on a page, step back a page.
      if (rows.length === 1 && paginationModel.page > 0) {
        setPaginationModel((m) => ({ ...m, page: m.page - 1 }));
      } else {
        fetchRows();
      }
    } catch {
      setToast({ msg: 'Delete failed', sev: 'error' });
    } finally {
      setToDelete(null);
    }
  }

  const columns = useMemo<GridColDef<Hospital>[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 180 },
      { field: 'location', headerName: 'Location', flex: 1, minWidth: 130 },
      { field: 'address', headerName: 'Address', flex: 1.8, minWidth: 220 },
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

  // Enable Save only when all fields are filled AND something changed, so a
  // no-op Edit can't fire an empty update.
  const filled = !!form.name.trim() && !!form.location.trim() && !!form.address.trim();
  const dirty = editing
    ? form.name.trim() !== editing.name ||
      form.location.trim() !== editing.location ||
      form.address.trim() !== editing.address
    : true;
  const canSave = filled && dirty;

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
        <Typography variant="h4">Manage Hospitals</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View every registered hospital below. Use the action icons on each row to edit or delete, or add a new one.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <TextField
          placeholder="Search by name, location or address…"
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
          Add Hospital
        </Button>
      </Stack>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(r) => r._id}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
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
        <DialogTitle>{editing ? 'Edit Hospital' : 'Add Hospital'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Hospital Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
              autoFocus
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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
        <DialogTitle>Delete hospital?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete “{toDelete?.name}”? This cannot be undone.
          </Typography>
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
