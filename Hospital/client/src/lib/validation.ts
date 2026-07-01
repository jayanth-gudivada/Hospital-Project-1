import { ROLES } from './roles';
import { GENDER_CODES } from './genders';
import { RELATION_CODES } from './relations';

// Field-format rules shared with the server (Login model).
export const NAME_RX = /^[A-Za-z]+$/; // letters only
export const EMAIL_RX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const PHONE_RX = /^[0-9]{10}$/;

export interface UserFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export type UserFormErrors = Partial<Record<keyof UserFormValues, string>>;

// Validates the Add/Edit user form. On edit, a blank password means "keep current".
export function validateUser(v: UserFormValues, isEdit: boolean): UserFormErrors {
  const errors: UserFormErrors = {};

  if (!v.firstName.trim()) errors.firstName = 'First name is required';
  else if (!NAME_RX.test(v.firstName.trim())) errors.firstName = 'First name can only contain letters';

  // Middle name is optional, but must be letters only when provided.
  if (v.middleName.trim() && !NAME_RX.test(v.middleName.trim()))
    errors.middleName = 'Middle name can only contain letters';

  if (!v.lastName.trim()) errors.lastName = 'Last name is required';
  else if (!NAME_RX.test(v.lastName.trim())) errors.lastName = 'Last name can only contain letters';

  if (!v.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RX.test(v.email.trim())) errors.email = 'Enter a valid email address';

  if (!v.phone.trim()) errors.phone = 'Phone number is required';
  else if (!PHONE_RX.test(v.phone.trim())) errors.phone = 'Phone number must be exactly 10 digits';

  // Password required on create; no minimum length.
  if (!isEdit && !v.password.trim()) errors.password = 'Password is required';

  if (!ROLES.some((r) => r.code === v.role)) errors.role = 'Select a role';

  return errors;
}

// ----- Patient profile screen -----

export interface ProfileFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // "YYYY-MM-DD" from the date input, '' when unset
  gender: string; // code, '' when unset
  address: string;
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

// True when the date string is a real, non-future calendar date.
function isValidPastDate(value: string): boolean {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() <= Date.now();
}

// Validates the patient's own profile. Name/email/phone are required (they mirror
// the account fields); date of birth, gender and address are optional.
export function validateProfile(v: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!v.firstName.trim()) errors.firstName = 'First name is required';
  else if (!NAME_RX.test(v.firstName.trim())) errors.firstName = 'First name can only contain letters';

  if (v.middleName.trim() && !NAME_RX.test(v.middleName.trim()))
    errors.middleName = 'Middle name can only contain letters';

  if (!v.lastName.trim()) errors.lastName = 'Last name is required';
  else if (!NAME_RX.test(v.lastName.trim())) errors.lastName = 'Last name can only contain letters';

  if (!v.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RX.test(v.email.trim())) errors.email = 'Enter a valid email address';

  if (!v.phone.trim()) errors.phone = 'Phone number is required';
  else if (!PHONE_RX.test(v.phone.trim())) errors.phone = 'Phone number must be exactly 10 digits';

  if (v.dateOfBirth.trim() && !isValidPastDate(v.dateOfBirth.trim()))
    errors.dateOfBirth = 'Enter a valid date of birth';

  if (v.gender.trim() && !GENDER_CODES.includes(v.gender.trim())) errors.gender = 'Select a valid gender';

  return errors;
}

// ----- Family member ("Add People") -----

export interface FamilyFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  gender: string;
  address: string;
  relation: string; // code
}

export type FamilyFormErrors = Partial<Record<keyof FamilyFormValues, string>>;

// Validates one family member. Only first/last name and relation are required;
// contact fields are optional but must be well-formed when provided.
export function validateFamilyMember(v: FamilyFormValues): FamilyFormErrors {
  const errors: FamilyFormErrors = {};

  if (!v.firstName.trim()) errors.firstName = 'First name is required';
  else if (!NAME_RX.test(v.firstName.trim())) errors.firstName = 'First name can only contain letters';

  if (v.middleName.trim() && !NAME_RX.test(v.middleName.trim()))
    errors.middleName = 'Middle name can only contain letters';

  if (!v.lastName.trim()) errors.lastName = 'Last name is required';
  else if (!NAME_RX.test(v.lastName.trim())) errors.lastName = 'Last name can only contain letters';

  if (v.email.trim() && !EMAIL_RX.test(v.email.trim())) errors.email = 'Enter a valid email address';

  if (v.phone.trim() && !PHONE_RX.test(v.phone.trim())) errors.phone = 'Phone number must be exactly 10 digits';

  if (v.dateOfBirth.trim() && !isValidPastDate(v.dateOfBirth.trim()))
    errors.dateOfBirth = 'Enter a valid date of birth';

  if (v.gender.trim() && !GENDER_CODES.includes(v.gender.trim())) errors.gender = 'Select a valid gender';

  if (!RELATION_CODES.includes(v.relation.trim())) errors.relation = 'Select a relation';

  return errors;
}
