import request from '@/utils/request';

export async function getMenus(): Promise<any> {
  return request('/api/app/menus');
}
