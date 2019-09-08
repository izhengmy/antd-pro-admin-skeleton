import request from '@/utils/request';

export interface EasySmsLogPaginateParamsType {
  mobileNumber?: string;
  successful?: 0 | 1;
  startCreatedAt?: string;
  endCreatedAt?: string;
  page?: number;
}

export async function paginate(params: EasySmsLogPaginateParamsType): Promise<any> {
  return request('/api/easy-sms-logs', {
    params,
  });
}
