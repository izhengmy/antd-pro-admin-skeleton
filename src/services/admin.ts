import request from '@/utils/request';

export interface AdminPaginateParamsType {
  key?: 'username' | 'mobileNumber';
  keyword?: string;
  enabled?: 0 | 1;
  page?: number;
}

export interface AdminStoreParamsType {
  username: string;
  mobileNumber: string;
  password: string;
  passwordConfirmation: string;
  realName: string;
  enabled: boolean;
  roleIds: number[];
}

export interface AdminUpdateParamsType {
  username: string;
  mobileNumber: string;
  password?: string;
  passwordConfirmation?: string;
  realName: string;
  enabled: boolean;
  roleIds: number[];
}

export async function paginate(params: AdminPaginateParamsType): Promise<any> {
  return request('/api/admins', {
    params,
  });
}

export async function store(params: AdminStoreParamsType): Promise<any> {
  return request('/api/admins', {
    method: 'POST',
    data: params,
  });
}

export async function get(id: number): Promise<any> {
  return request(`/api/admins/${id}`);
}

export async function update(params: AdminUpdateParamsType, id: number): Promise<any> {
  return request(`/api/admins/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(id: number): Promise<any> {
  return request(`/api/admins/${id}`, {
    method: 'DELETE',
  });
}

export async function restore(id: number): Promise<any> {
  return request(`/api/admins/${id}/restore`, {
    method: 'POST',
  });
}
