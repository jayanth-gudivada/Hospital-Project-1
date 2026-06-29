import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Pre-typed Redux hooks — use these instead of the plain useDispatch/useSelector.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Convenience selector for the authenticated user + boot-loading flag.
export const useAuth = () => useAppSelector((s) => s.auth);
