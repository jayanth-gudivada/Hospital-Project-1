import { Box, Typography, Stack, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { newsletters } from '../../data/patientDummy';
import SectionCard from './SectionCard';

// Reference health newsletters as external links; "See all" is a placeholder.
export default function HealthReadsCard({ onDummyAction }: { onDummyAction: (label: string) => void }) {
  return (
    <SectionCard
      icon={<ArticleIcon />}
      title="Health Reads"
      action={
        <Link component="button" type="button" underline="hover" variant="body2" onClick={() => onDummyAction('Health Reads')}>
          See all →
        </Link>
      }
    >
      <Stack spacing={0.5}>
        {newsletters.map((n) => (
          <Link
            key={n.title}
            href={n.href}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={(t) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1,
              borderRadius: 1.5,
              color: 'text.primary',
              transition: 'background-color 0.15s',
              // Row highlights on hover and reveals its trailing arrow.
              '&:hover': { bgcolor: t.palette.action.hover },
              '&:hover .go': { opacity: 1, transform: 'translateX(0)' },
            })}
          >
            <Box
              sx={(t) => ({
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: 1.5,
                color: 'primary.main',
                bgcolor: alpha(t.palette.primary.main, 0.1),
              })}
            >
              <MenuBookIcon fontSize="small" />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {n.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {n.source}
              </Typography>
            </Box>
            <ArrowForwardIcon
              className="go"
              fontSize="small"
              sx={{ color: 'primary.main', opacity: 0, transform: 'translateX(-4px)', transition: '0.15s' }}
            />
          </Link>
        ))}
      </Stack>
    </SectionCard>
  );
}
