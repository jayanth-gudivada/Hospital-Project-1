import { Box, Typography, Link, Chip } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { nearestLocation } from '../../data/patientDummy';
import SectionCard from './SectionCard';

// Map preview first (instantly reads as a location), then the address details.
export default function NearestLocationCard({ onDummyAction }: { onDummyAction: (label: string) => void }) {
  const loc = nearestLocation;
  return (
    <SectionCard
      icon={<PlaceIcon />}
      title="Nearest Location"
      action={
        <Link component="button" type="button" underline="hover" variant="body2" onClick={() => onDummyAction('Map')}>
          Map
        </Link>
      }
    >
      <Box
        sx={(t) => ({
          position: 'relative',
          height: 128,
          borderRadius: 1.5,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          // Faux map surface: flat base colour + a grid overlay so it reads like a map.
          backgroundColor: t.palette.mode === 'dark' ? 'hsl(222, 20%, 16%)' : 'hsl(187, 30%, 88%)',
          backgroundImage:
            'linear-gradient(rgba(128,128,128,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.22) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        })}
      >
        <LocationOnIcon
          color="error"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            fontSize: 34,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
          }}
        />
        <Chip label={loc.distance} size="small" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'background.paper', boxShadow: 1, fontWeight: 600 }} />
      </Box>

      <Box sx={{ mt: 1.25 }}>
        <Typography variant="subtitle2">{loc.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {loc.address}
        </Typography>
      </Box>
    </SectionCard>
  );
}
