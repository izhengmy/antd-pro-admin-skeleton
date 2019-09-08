import { ValidationRule } from 'antd/es/form';
import regex from '@/utils/regex';

const username: ValidationRule[] = [
  {
    required: true,
    message: '请输入用户名',
  },
];

const password: ValidationRule[] = [
  {
    required: true,
    message: '请输入密码',
  },
];

const captcha: ValidationRule[] = [
  {
    required: true,
    message: '请输入验证码',
  },
];

const mobileNumber: ValidationRule[] = [
  {
    required: true,
    message: '请输入手机号码',
  },
  {
    pattern: regex.chinaMobileNumber,
    message: '手机号码格式不正确',
  },
];

const smsCaptcha: ValidationRule[] = [
  {
    required: true,
    message: '请输入短信验证码',
  },
];

const passwordConfirmation: ValidationRule[] = [
  {
    required: true,
    message: '请确认密码',
  },
];

export default {
  username,
  password,
  captcha,
  mobileNumber,
  smsCaptcha,
  passwordConfirmation,
};
