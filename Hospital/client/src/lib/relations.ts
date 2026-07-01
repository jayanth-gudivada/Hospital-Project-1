// Relation codes match the server's string storage codes (server/constants/relations.js).
export const RELATIONS = [
  { code: '01', label: 'Father' },
  { code: '02', label: 'Mother' },
  { code: '03', label: 'Brother' },
  { code: '04', label: 'Sister' },
  { code: '05', label: 'Grandfather' },
  { code: '06', label: 'Grandmother' },
  { code: '07', label: 'Uncle' },
  { code: '08', label: 'Aunt' },
  { code: '09', label: 'Son' },
  { code: '10', label: 'Daughter' },
  { code: '11', label: 'Nephew' },
  { code: '12', label: 'Niece' },
  { code: '13', label: 'Spouse' },
  { code: '99', label: 'Other' },
] as const;

export const RELATION_CODES: string[] = RELATIONS.map((r) => r.code);

// Turns a stored relation code into its display label (em dash when unknown/missing).
export function relationLabel(code?: string): string {
  return RELATIONS.find((r) => r.code === code)?.label ?? '—';
}
