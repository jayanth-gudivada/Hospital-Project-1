// Role codes match the server's string storage codes (server/constants/roles.js):
// "01" patient, "02" doctor, "03" admin.
export const ROLE_PATIENT = '01';
export const ROLE_DOCTOR = '02';
export const ROLE_ADMIN = '03';

export const ROLES = [
  { code: ROLE_PATIENT, label: 'Patient' },
  { code: ROLE_DOCTOR, label: 'Doctor' },
  { code: ROLE_ADMIN, label: 'Admin' },
] as const;

export const DEFAULT_ROLE = ROLE_PATIENT;

// Turns a stored role code into its display label (em dash when unknown/missing).
export function roleLabel(code?: string): string {
  return ROLES.find((r) => r.code === code)?.label ?? '—';
}

// Legacy accounts predate roles and were all admins, so treat a missing role as admin.
export function effectiveRole(code?: string): string {
  return code ?? ROLE_ADMIN;
}

// The landing route each role is sent to after login (and gated to).
export function roleHome(code?: string): string {
  switch (effectiveRole(code)) {
    case ROLE_DOCTOR:
      return '/doctor';
    case ROLE_PATIENT:
      return '/patient';
    case ROLE_ADMIN:
    default:
      return '/admin';
  }
}
