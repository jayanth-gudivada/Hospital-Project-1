import { useEffect, useMemo, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme';
import { useAppSelector } from '../store/hooks';
import { THEME_STORAGE_KEY } from '../store/themeSlice';

// Builds the MUI theme from the store's current mode and persists the choice,
// so the light/dark preference survives reloads. Wraps the whole app.
export default function AppThemeProvider({ children }: { children: ReactNode }) {
  const mode = useAppSelector((s) => s.theme.mode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
