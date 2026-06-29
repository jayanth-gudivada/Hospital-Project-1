import { Box, Card, CardContent, Typography, IconButton, Stack } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title: 'Manage Hospitals',
    text: 'View, add, update and delete hospitals from one table.',
    icon: <LocalHospitalIcon fontSize="large" />,
    to: '/admin/hospitals',
  },
  {
    title: 'Manage Users',
    text: 'View, add, update and delete admin users from one table.',
    icon: <GroupIcon fontSize="large" />,
    to: '/admin/users',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, Chief.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose an area to manage.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {cards.map((c) => (
          <Card key={c.to} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ color: 'primary.dark' }}>{c.icon}</Box>
                <Typography variant="h6">{c.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.text}
                </Typography>
                <Box>
                  <IconButton
                    color="primary"
                    aria-label={c.title}
                    onClick={() => navigate(c.to)}
                    sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
