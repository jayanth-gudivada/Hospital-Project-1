import { Stack, Typography } from '@mui/material';
import BackButton from './BackButton';

// Heading shared by admin list pages: a back button, a title, and helper text.
export default function PageHeader({
  backTo,
  title,
  description,
}: {
  backTo: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
        <BackButton to={backTo} label="Back to dashboard" />
        <Typography variant="h4">{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
    </>
  );
}
