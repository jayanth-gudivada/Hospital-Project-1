import { Box, Typography, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import { rejectedAppointments } from '../../data/patientDummy';
import SectionCard from './SectionCard';

// Lists any appointments a doctor turned down, with a red accent.
export default function RejectedCard() {
  return (
    <SectionCard icon={<CancelIcon color="error" />} title="Rejected">
      {rejectedAppointments.length ? (
        <Stack spacing={1.25}>
          {rejectedAppointments.map((r) => (
            <Box
              key={r.id}
              sx={(t) => ({
                p: 1.25,
                borderRadius: 1.5,
                borderLeft: '3px solid',
                borderColor: 'error.main',
                backgroundColor: alpha(t.palette.error.main, t.palette.mode === 'dark' ? 0.18 : 0.08),
              })}
            >
              <Typography variant="body2">
                <b>{r.date}</b> · {r.doctor}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {r.reason}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No rejected appointments.
        </Typography>
      )}
    </SectionCard>
  );
}
