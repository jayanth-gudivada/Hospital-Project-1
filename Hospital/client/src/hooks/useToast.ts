import { useCallback, useState } from 'react';

export type ToastState = { msg: string; sev: 'success' | 'error' } | null;

// Shared show/hide state for the bottom Snackbar notifications used across pages.
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = useCallback(
    (msg: string, sev: 'success' | 'error') => setToast({ msg, sev }),
    []
  );
  const hideToast = useCallback(() => setToast(null), []);
  return { toast, showToast, hideToast };
}
