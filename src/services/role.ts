import { praseHttpParams } from '@/utils/utils';
import request from '@/utils/request';

export interface RolePaginateParamsType {
  paginate?: boolean;
  page?: number;
}

export interface RoleParamsType {
  name: string;
  cnName: string;
  permissionIds: number[];
  menuIds: number[];
}

export async function paginate(params: RolePaginateParamsType): Promise<any> {
  return request('/api/roles', {
    params: praseHttpParams(params, true),
  });
}

export async function all(): Promise<any> {
  return paginate({
    paginate: false,
  });
}

export async function store(params: RoleParamsType): Promise<any> {
  return request('/api/roles', {
    method: 'POST',
    data: params,
  });
}

export async function get(id: number): Promise<any> {
  return request(`/api/roles/${id}`);
}

export async function update(params: RoleParamsType, id: number): Promise<any> {
  return request(`/api/roles/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(id: number): Promise<any> {
  return request(`/api/roles/${id}`, {
    method: 'DELETE',
  });
}
