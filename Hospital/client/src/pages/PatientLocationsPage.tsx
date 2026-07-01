import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { listHospitals, type Hospital } from '../api/hospitals';

// Patient-facing directory of hospitals. Mirrors the admin "Manage Hospitals"
// listing but read-only, and swaps the edit/delete actions for a single
// "Consult now" call-to-action per row (the patient is already signed in here,
// so it navigates straight to the consult flow).
export default function PatientLocationsPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Load the hospitals matching the current (debounced) search term.
  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listHospitals({ search, limit: 100 });
      setRows(res.items);
    } catch {
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        <Typography variant="h6">Locations</Typography>
        <Typography variant="body2" color="text.secondary">
          Browse our hospitals and start a consultation at the one nearest you.
        </Typography>
      </Stack>

      <TextField
        placeholder="Search by name, location or address…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        size="small"
        sx={{ maxWidth: 360, width: '100%', mb: 2 }}
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Hospital</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell align="right"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Content-shaped skeleton rows while the list loads.
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton width="60%" /></TableCell>
                  <TableCell><Skeleton width="40%" /></TableCell>
                  <TableCell align="right"><Skeleton width={110} height={32} sx={{ ml: 'auto' }} /></TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    {search ? `No hospitals found for “${search}”.` : 'No hospitals available yet.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((h) => (
                <TableRow key={h._id} hover>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>{h.location}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LocalHospitalIcon />}
                      onClick={() => navigate(`/patient/consult/${h._id}`)}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Consult now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
