import request from '@/utils/request';

export interface MenuParamsType {
  parentId: number | null;
  path: string;
  name: string;
  icon?: string;
  sort: number;
  newWindow: boolean;
  enabled: boolean;
}

export async function all(): Promise<any> {
  return request('/api/menus');
}

export async function store(params: MenuParamsType): Promise<any> {
  return request('/api/menus', {
    method: 'POST',
    data: params,
  });
}

export async function get(id: number): Promise<any> {
  return request(`/api/menus/${id}`);
}

export async function update(params: MenuParamsType, id: number): Promise<any> {
  return request(`/api/menus/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function destroy(id: number): Promise<any> {
  return request(`/api/menus/${id}`, {
    method: 'DELETE',
  });
}
