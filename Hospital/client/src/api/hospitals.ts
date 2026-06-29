import api from './client';

export interface Hospital {
  _id: string;
  name: string;
  location: string;
  address: string;
}

export interface HospitalInput {
  name: string;
  location: string;
  address: string;
}

interface ListResponse {
  items: Hospital[];
  total: number;
  page: number;
  limit: number;
}

export async function listHospitals(params: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ListResponse> {
  const res = await api.get<ListResponse>('/hospitals', { params });
  return res.data;
}

export async function createHospital(data: HospitalInput): Promise<Hospital> {
  const res = await api.post('/hospitals', data);
  return res.data.hospital;
}

export async function updateHospital(id: string, data: HospitalInput): Promise<Hospital> {
  const res = await api.put(`/hospitals/${id}`, data);
  return res.data.hospital;
}

export async function deleteHospital(id: string): Promise<void> {
  await api.delete(`/hospitals/${id}`);
}
