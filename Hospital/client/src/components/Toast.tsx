import { Snackbar, Alert } from '@mui/material';
import type { ToastState } from '../hooks/useToast';

// Renders the shared toast state as a bottom-center, auto-dismissing Snackbar.
export default function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {toast ? (
        <Alert severity={toast.sev} onClose={onClose} variant="filled">
          {toast.msg}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
