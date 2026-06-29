import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaletteMode } from '@mui/material';

export const THEME_STORAGE_KEY = 'doclab_theme';

// Initial mode: a previously saved choice → the OS preference → light.
function initialMode(): PaletteMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = { mode: initialMode() };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setMode(state, action: PayloadAction<PaletteMode>) {
      state.mode = action.payload;
    },
  },
});

export const { toggleMode, setMode } = themeSlice.actions;
export default themeSlice.reducer;
