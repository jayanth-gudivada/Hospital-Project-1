import { Box, Stack } from '@mui/material';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import NextAppointmentCard from '../components/patient/NextAppointmentCard';
import QuickActionsCard from '../components/patient/QuickActionsCard';
import AppointmentsCalendar from '../components/patient/AppointmentsCalendar';
import RejectedCard from '../components/patient/RejectedCard';
import NearestLocationCard from '../components/patient/NearestLocationCard';
import PrescriptionHistory from '../components/patient/PrescriptionHistory';
import HealthReadsCard from '../components/patient/HealthReadsCard';

// Patient dashboard: a bento grid of appointment, location, and health widgets.
export default function PatientHomePage() {
  const { toast, showToast, hideToast } = useToast();

  // Dummy buttons just acknowledge the click until the real flows are built.
  const handleDummy = (label: string) => showToast(`${label} — coming soon`, 'info');

  return (
    <Box>
      {/* All rows share one column ratio so the centre gutter stays aligned (symmetry). */}
      <Stack spacing={2}>
        {/* Row 1: next appointment hero + quick actions */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' }, alignItems: 'stretch' }}>
          <NextAppointmentCard onDummyAction={handleDummy} />
          <QuickActionsCard onDummyAction={handleDummy} />
        </Box>

        {/* Row 2: calendar + (rejected, nearest location) */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' }, alignItems: 'stretch' }}>
          <AppointmentsCalendar />
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <RejectedCard />
            <NearestLocationCard onDummyAction={handleDummy} />
          </Stack>
        </Box>

        {/* Row 3: prescriptions + health reads */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' }, alignItems: 'stretch' }}>
          <PrescriptionHistory />
          <HealthReadsCard onDummyAction={handleDummy} />
        </Box>
      </Stack>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
