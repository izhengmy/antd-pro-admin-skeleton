import request from '@/utils/request';

export interface ProfileUpdateParamsType {
  username: string;
  mobileNumber: string;
  realName: string;
}

export interface PasswordUpdateParamsType {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export async function getProfile(): Promise<any> {
  return request('/api/account/profile');
}

export async function updateProfile(params: ProfileUpdateParamsType): Promise<any> {
  return request('/api/account/profile', {
    method: 'PUT',
    data: params,
  });
}

export async function updatePassword(params: PasswordUpdateParamsType): Promise<any> {
  return request('/api/account/password', {
    method: 'PUT',
    data: params,
  });
}
