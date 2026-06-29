import { ROLES } from './roles';

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
