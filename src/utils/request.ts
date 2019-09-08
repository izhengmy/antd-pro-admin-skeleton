/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { ResponseError, extend } from 'umi-request';
import { destroyPermissions, destroyRoles } from './permission';
import { destroyToken, getToken } from './jwtToken';

import { message } from 'antd';
import { praseHttpParams } from './utils';
import router from 'umi/router';

const codeMessage = {
  400: '请求错误',
  401: '未登录或登录已过期',
  403: '无访问权限',
  404: '资源不存在',
  405: '请求方法错误',
  406: '请求格式错误',
  413: '请求数据大小超过限制',
  422: '请求参数错误',
  429: '您的操作过于频繁，请稍后重试',
  500: '服务器错误',
  502: '网关错误',
  503: '服务器正在维护中',
  504: '网关超时',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError): Response => {
  const { response, data } = error;
  const status = response.status || 500;
  let errorMessage = codeMessage[status] || response.statusText;

  if (status >= 300 && status < 400) {
    return response;
  }

  if (status === 401) {
    destroyToken();
    destroyRoles();
    destroyPermissions();
    const redirect = encodeURI(window.location.href);
    router.replace({
      pathname: '/auth/login',
      query: { redirect },
    });
  } else if (status === 404) {
    errorMessage = data.message;
    message.error(errorMessage);
  } else if (status === 422) {
    const firstError: any = Object.values(data.errors)[0];
    errorMessage = firstError || errorMessage;
    message.error(errorMessage);
  } else {
    message.error(errorMessage);
  }

  return data;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
});

request.interceptors.request.use((url, options: any) => {
  const newOptions = { ...options };
  const { data } = newOptions;
  newOptions.headers.Authorization = `Bearer ${getToken()}`;
  newOptions.data = praseHttpParams(data);
  return { url, ...newOptions };
});

request.interceptors.response.use(async response => {
  if (response.status === 204) {
    return response;
  }
  const data = await response.clone().json();
  const { message: msg, code } = data;
  if (code.toString().length === 8) {
    message.error(`${msg}（${code}）`);
  }
  return response;
});

export default request;
