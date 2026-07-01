import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Stack, Typography, Button } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Placeholder destination for the "Consult now" action. The booking flow lands
// here for now; real scheduling against the chosen hospital arrives in a later
// iteration (hence the hospital id is already carried in the URL).
export default function ConsultPage() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: { xs: 4, md: 8 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, maxWidth: 520, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: '#fff' }}>
            <EventAvailableIcon fontSize="large" />
          </Box>
          <Typography variant="h5">Consultation booking</Typography>
          <Typography variant="body2" color="text.secondary">
            You're all set to consult with this hospital. Online scheduling is coming
            in the next update — for now this confirms your request has been captured.
          </Typography>
          {hospitalId && (
            <Typography variant="caption" color="text.secondary">
              Reference: {hospitalId}
            </Typography>
          )}
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/patient/locations')}>
            Back to Locations
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
