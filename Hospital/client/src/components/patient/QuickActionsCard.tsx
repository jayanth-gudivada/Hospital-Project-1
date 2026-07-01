import { Button, Stack, Box, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MailOutlineIcon from '@mui/icons-material/EmailOutlined';
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import ReplayIcon from '@mui/icons-material/Autorenew';
import SectionCard from './SectionCard';

// The three secondary shortcuts under the primary "Book Appointment" action.
const shortcuts = [
  { key: 'Contact', icon: <MailOutlineIcon /> },
  { key: 'Reports', icon: <DescriptionIcon /> },
  { key: 'Refill', icon: <ReplayIcon /> },
];

// Quick actions panel: one prominent CTA plus a row of icon shortcuts (all dummy).
export default function QuickActionsCard({ onDummyAction }: { onDummyAction: (label: string) => void }) {
  return (
    <SectionCard icon={<BoltIcon />} title="Quick Actions">
      <Stack spacing={1.25} sx={{ height: '100%' }}>
        <Button variant="contained" size="large" startIcon={<EventAvailableIcon />} onClick={() => onDummyAction('Book Appointment')}>
          Book Appointment
        </Button>

        {/* Shortcut tiles grow to fill the remaining card height, balancing the hero. */}
        <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {shortcuts.map((s) => (
            <Button
              key={s.key}
              onClick={() => onDummyAction(s.key)}
              variant="outlined"
              sx={{
                height: '100%',
                minHeight: 76,
                flexDirection: 'column',
                gap: 0.75,
                borderColor: 'divider',
                color: 'text.primary',
                '& svg': { fontSize: 22 },
              }}
            >
              <Box sx={{ color: 'primary.main', display: 'flex' }}>{s.icon}</Box>
              <Typography variant="caption">{s.key}</Typography>
            </Button>
          ))}
        </Box>
      </Stack>
    </SectionCard>
  );
}
