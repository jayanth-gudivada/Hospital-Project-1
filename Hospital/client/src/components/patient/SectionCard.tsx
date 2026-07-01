import { type ReactNode } from 'react';
import { Paper, Stack, Box, Typography, type SxProps, type Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Shared titled panel giving every patient section one consistent look:
// a tinted icon badge, a heading, an optional action, and a soft bordered card.
export default function SectionCard({
  icon,
  title,
  action,
  children,
  sx,
}: {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={0}
      sx={[
        (t) => ({
          height: '100%',
          // Flex column so the body can fill the card when a row stretches it.
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, md: 2 },
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          // Very light lift on hover so panels feel interactive without shouting.
          transition: 'box-shadow 0.2s, transform 0.2s',
          '&:hover': { boxShadow: t.palette.mode === 'dark' ? 3 : 2 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1.5 }}>
        {icon && (
          <Box
            sx={(t) => ({
              display: 'flex',
              p: 0.75,
              borderRadius: 1.5,
              color: 'primary.main',
              bgcolor: alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.12),
              '& svg': { fontSize: 20 },
            })}
          >
            {icon}
          </Box>
        )}
        <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {title}
        </Typography>
        {action}
      </Stack>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
