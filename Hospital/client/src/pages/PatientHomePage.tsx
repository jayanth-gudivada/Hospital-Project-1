import { Box, Typography } from '@mui/material';
import { useAuth } from '../store/hooks';

// Placeholder landing for patient accounts — functionality to be built out later.
export default function PatientHomePage() {
  const { user } = useAuth();
  const name = user?.firstName ? `, ${user.firstName}` : '';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hello{name} 👋
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to the patient portal. Your tools are coming soon.
      </Typography>
    </Box>
  );
}
