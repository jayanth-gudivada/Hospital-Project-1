// Gender codes match the server's string storage codes (server/constants/genders.js):
// "01" Male, "02" Female, "03" Trans, "04" Other.
export const GENDER_MALE = '01';
export const GENDER_FEMALE = '02';
export const GENDER_TRANS = '03';
export const GENDER_OTHER = '04';

export const GENDERS = [
  { code: GENDER_MALE, label: 'Male' },
  { code: GENDER_FEMALE, label: 'Female' },
  { code: GENDER_TRANS, label: 'Trans' },
  { code: GENDER_OTHER, label: 'Other' },
] as const;

export const GENDER_CODES: string[] = GENDERS.map((g) => g.code);

// Turns a stored gender code into its display label (em dash when unknown/missing).
export function genderLabel(code?: string): string {
  return GENDERS.find((g) => g.code === code)?.label ?? '—';
}
