import { IconButton, Tooltip } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMode } from '../store/themeSlice';

// Light/Dark switch — reads and flips the global theme mode.
export default function ThemeToggle({ color = 'inherit' }: { color?: 'inherit' | 'default' }) {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((s) => s.theme.mode) === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton color={color} onClick={() => dispatch(toggleMode())} aria-label="Toggle dark mode">
        {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
