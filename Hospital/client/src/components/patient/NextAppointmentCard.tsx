import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import DirectionsIcon from '@mui/icons-material/Directions';
import PlaceIcon from '@mui/icons-material/Place';
import { nextAppointment } from '../../data/patientDummy';

// Hero card: the patient's next upcoming appointment on a brand-teal gradient.
export default function NextAppointmentCard({ onDummyAction }: { onDummyAction: (label: string) => void }) {
  const a = nextAppointment;
  return (
    <Box
      sx={(t) => ({
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        p: { xs: 2, md: 2.5 },
        borderRadius: 2.5,
        color: '#fff',
        background: `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 100%)`,
      })}
    >
      {/* Soft decorative circle in the corner. */}
      <Box sx={{ position: 'absolute', top: -40, right: -30, width: 170, height: 170, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />

      <Stack sx={{ position: 'relative' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1 }}>
            Next Appointment
          </Typography>
          <Chip label={a.status} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }} />
        </Stack>

        <Typography variant="h6" sx={{ color: 'inherit', mt: 0.5, fontWeight: 700, fontSize: '1.35rem' }}>
          {a.dateLabel} · {a.time}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1.25, fontWeight: 600 }}>
          {a.doctor}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
          {a.specialty}
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.75, opacity: 0.9 }}>
          <PlaceIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{a.location}</Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button
            size="small"
            onClick={() => onDummyAction('Reschedule')}
            startIcon={<EventRepeatIcon />}
            sx={{ bgcolor: '#fff', color: 'primary.dark', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
          >
            Reschedule
          </Button>
          <Button
            size="small"
            onClick={() => onDummyAction('Directions')}
            startIcon={<DirectionsIcon />}
            variant="outlined"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Directions
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
