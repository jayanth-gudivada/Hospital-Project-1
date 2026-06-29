import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import api, { getToken, setToken } from '../api/client';
import { getErrorMessage } from '../lib/errors';

// The signed-in user kept in the store for the whole login session.
export interface AuthUser {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean; // true while validating an existing token on boot
}

// Start in "loading" only if a token exists and needs validating.
const initialState: AuthState = { user: null, loading: !!getToken() };

// Log in, persist the JWT, and return the profile for the store.
// On failure, reject with the server's message so the UI can show it.
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      setToken(res.data.token);
      return res.data.user as AuthUser;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Login failed. Please try again.'));
    }
  }
);

// On boot/refresh, reload the profile from the token so the store survives reloads.
export const loadSession = createAsyncThunk('auth/loadSession', async () => {
  const res = await api.get('/auth/me');
  return res.data.user as AuthUser;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear the JWT + stored user on sign-out.
    logout(state) {
      setToken(null);
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
      })
      .addCase(loadSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSession.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loadSession.rejected, (state) => {
        // Token invalid/expired — drop it and finish booting.
        setToken(null);
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
