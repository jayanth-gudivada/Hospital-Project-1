import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Outlined back-arrow button that fills with the brand color on hover.
export default function BackButton({ to, label = 'Go back' }: { to: string; label?: string }) {
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label={label}
      onClick={() => navigate(to)}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        color: 'text.secondary',
        transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
        '&:hover': {
          bgcolor: 'primary.main',
          borderColor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
}
