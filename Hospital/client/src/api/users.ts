import api from './client';

export interface User {
  _id: string;
  email: string;
  createdAt?: string;
}

export async function listUsers(): Promise<User[]> {
  const res = await api.get('/users');
  return res.data.items;
}

export async function createUser(data: { email: string; password: string }): Promise<void> {
  await api.post('/users', data);
}

// password optional — only changed when a non-empty value is sent
export async function updateUser(
  id: string,
  data: { email: string; password?: string }
): Promise<void> {
  await api.put(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
