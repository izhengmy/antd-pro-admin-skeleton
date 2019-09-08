import request from '@/utils/request';

export interface PasswordLoginParamsType {
  username: string;
  password: string;
  captchaKey: string;
  captcha: string;
}

export interface SmsCaptchaParamsType {
  mobileNumber: string;
  captchaKey: string;
  captcha: string;
}

export interface SmsCaptchaLoginParamsType {
  mobileNumber: string;
  smsCaptcha: string;
}

export interface ResetPasswordParamsType {
  mobileNumber: string;
  smsCaptcha: string;
  password: string;
  passwordConfirmation: string;
}

export async function getCaptcha(): Promise<any> {
  return request('/api/auth/captcha');
}

export async function passwordLogin(params: PasswordLoginParamsType): Promise<any> {
  return request('/api/auth/password-login', {
    method: 'POST',
    data: params,
  });
}

export async function getSmsCaptcha(params: SmsCaptchaParamsType): Promise<any> {
  return request('/api/auth/sms-captcha', {
    params,
  });
}

export async function smsCaptchaLogin(params: SmsCaptchaLoginParamsType): Promise<any> {
  return request('/api/auth/sms-captcha-login', {
    method: 'POST',
    data: params,
  });
}

export async function logout(): Promise<any> {
  return request('/api/auth/logout', {
    method: 'POST',
  });
}

export async function resetPassword(params: ResetPasswordParamsType): Promise<any> {
  return request('/api/auth/reset-password', {
    method: 'POST',
    data: params,
  });
}
