import { IconButton, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMode } from '../store/themeSlice';

// Light/Dark switch — reads and flips the global theme mode.
// `sx`/`size` let a host (e.g. the patient top bar) restyle the button to match
// its own controls, without affecting the bare over-gradient look used elsewhere.
export default function ThemeToggle({
  color = 'inherit',
  size,
  sx,
}: {
  color?: 'inherit' | 'default';
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}) {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((s) => s.theme.mode) === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton color={color} size={size} sx={sx} onClick={() => dispatch(toggleMode())} aria-label="Toggle dark mode">
        {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
