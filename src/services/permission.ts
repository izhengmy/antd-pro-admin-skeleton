import { praseHttpParams } from '@/utils/utils';
import request from '@/utils/request';

export interface PermissionPaginateParamsType {
  paginate?: boolean;
  page?: number;
}

export interface PermissionParamsType {
  name: string;
  cnName: string;
}

export async function paginate(params: PermissionPaginateParamsType): Promise<any> {
  return request('/api/permissions', {
    params: praseHttpParams(params, true),
  });
}

export async function all(): Promise<any> {
  return paginate({
    paginate: false,
  });
}

export async function store(params: PermissionParamsType): Promise<any> {
  return request('/api/permissions', {
    method: 'POST',
    data: params,
  });
}

export async function get(id: number): Promise<any> {
  return request(`/api/permissions/${id}`);
}

export async function update(params: PermissionParamsType, id: number): Promise<any> {
  return request(`/api/permissions/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(id: number): Promise<any> {
  return request(`/api/permissions/${id}`, {
    method: 'DELETE',
  });
}
