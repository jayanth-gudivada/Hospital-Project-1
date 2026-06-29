// Role codes match the server's string storage codes (server/constants/roles.js):
// "01" patient, "02" doctor, "03" admin.
export const ROLES = [
  { code: '01', label: 'Patient' },
  { code: '02', label: 'Doctor' },
  { code: '03', label: 'Admin' },
] as const;

export const DEFAULT_ROLE = ROLES[0].code; // "01" (patient)

// Turns a stored role code into its display label (em dash when unknown/missing).
export function roleLabel(code?: string): string {
  return ROLES.find((r) => r.code === code)?.label ?? '—';
}
