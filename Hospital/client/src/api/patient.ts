import api from './client';

// The signed-in patient's own profile (mirrors server publicProfile()).
export interface PatientProfile {
  Id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO-8601 string, '' when unset
  gender: string; // code, '' when unset
  address: string;
  role?: string;
}

// One family member. Id is present for existing rows, absent for newly added ones.
export interface FamilyMember {
  Id?: number;
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

export interface ProfileResponse {
  profile: PatientProfile;
  family: FamilyMember[];
}

// Sent to PUT /profile — the whole screen in one payload.
export interface ProfileUpdateInput {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  family: FamilyMember[];
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await api.get('/patient/profile');
  return res.data;
}

// Saves profile + family together; returns the persisted state (with new Ids).
export async function updateProfile(data: ProfileUpdateInput): Promise<ProfileResponse> {
  const res = await api.put('/patient/profile', data);
  return res.data;
}
