import api from './client';

export interface User {
  _id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export async function listUsers(): Promise<User[]> {
  const res = await api.get('/users');
  return res.data.items;
}

export async function createUser(data: UserInput): Promise<void> {
  await api.post('/users', data);
}

// All fields optional on update; password is only changed when a value is sent.
export async function updateUser(id: string, data: Partial<UserInput>): Promise<void> {
  await api.put(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
