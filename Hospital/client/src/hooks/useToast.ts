import { useCallback, useState } from 'react';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';
export type ToastState = { msg: string; sev: ToastSeverity } | null;

// Shared show/hide state for the bottom Snackbar notifications used across pages.
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = useCallback(
    (msg: string, sev: ToastSeverity) => setToast({ msg, sev }),
    []
  );
  const hideToast = useCallback(() => setToast(null), []);
  return { toast, showToast, hideToast };
}
