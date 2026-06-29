import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Single app store; add more slices here as the app grows.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
