import { Box, Typography, Stack, Chip, Divider, Avatar } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import { prescriptions } from '../../data/patientDummy';
import SectionCard from './SectionCard';

// Doctors' past prescriptions — light, divider-separated rows with a brand accent.
export default function PrescriptionHistory() {
  return (
    <SectionCard icon={<MedicationIcon />} title="Prescription History">
      <Stack divider={<Divider />} spacing={1.75}>
        {prescriptions.map((p) => (
          <Box key={p.id} sx={{ borderLeft: '3px solid', borderColor: 'primary.main', pl: 1.5 }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30, fontSize: '0.8rem' }}>
                {p.doctor.replace('Dr. ', '').charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>{p.doctor}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.specialty}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {p.date}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {p.medicines.map((m) => (
                <Chip key={m} label={m} size="small" color="primary" variant="outlined" />
              ))}
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Notes:{' '}
              </Box>
              {p.notes}
            </Typography>
          </Box>
        ))}
      </Stack>
    </SectionCard>
  );
}
