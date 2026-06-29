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
  type GridPaginationModel,
} from '@mui/x-data-grid';
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
import { getErrorMessage } from '../lib/errors';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { dataGridSx, dataGridWrapperSx } from '../components/dataGridStyles';

const EMPTY: HospitalInput = { name: '', location: '', address: '' };

export default function HospitalsPage() {
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

  const { toast, showToast, hideToast } = useToast();

  // Load one server-side page of hospitals matching the current search.
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
      showToast('Failed to load hospitals', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, paginationModel, showToast]);

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

  // Open the dialog in "add" mode with empty fields.
  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  // Open the dialog in "edit" mode pre-filled with the row's values.
  function openEdit(h: Hospital) {
    setEditing(h);
    setForm({ name: h.name, location: h.location, address: h.address });
    setDialogOpen(true);
  }

  // Create or update the hospital, then refresh the grid.
  async function handleSave() {
    if (!form.name.trim() || !form.location.trim() || !form.address.trim()) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateHospital(editing._id, form);
        showToast('Hospital updated', 'success');
      } else {
        await createHospital(form);
        showToast('Hospital added', 'success');
      }
      setDialogOpen(false);
      fetchRows();
    } catch (err: unknown) {
      showToast(getErrorMessage(err, 'Save failed'), 'error');
    } finally {
      setSaving(false);
    }
  }

  // Delete the confirmed hospital, stepping back a page if it was the last row.
  async function handleDelete() {
    if (!toDelete) return;
    try {
      await deleteHospital(toDelete._id);
      showToast(`Hospital “${toDelete.name}” deleted`, 'success');
      if (rows.length === 1 && paginationModel.page > 0) {
        setPaginationModel((m) => ({ ...m, page: m.page - 1 }));
      } else {
        fetchRows();
      }
    } catch {
      showToast('Delete failed', 'error');
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
      <PageHeader
        backTo="/admin"
        title="Manage Hospitals"
        description="View every registered hospital below. Use the action icons on each row to edit or delete, or add a new one."
      />

      {/* Search box + Add button */}
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

      {/* Hospitals table */}
      <Box sx={dataGridWrapperSx}>
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
          sx={dataGridSx}
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
      <ConfirmDialog
        open={!!toDelete}
        title="Delete hospital?"
        message={`Delete “${toDelete?.name}”? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
