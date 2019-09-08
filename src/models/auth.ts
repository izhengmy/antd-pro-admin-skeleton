import * as service from '@/services/auth';

import { destroyPermissions, destroyRoles, storagePermissions, storageRoles } from '@/utils/permission';
import { destroyToken, getTokenPayload, storageToken } from '@/utils/jwtToken';
import { getPageQuery, okResponse, parseQueryString } from '@/utils/utils';

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { reloadAuthorized } from '@/utils/Authorized';
import router from 'umi/router';

export interface AuthModelState {
  passwordLogin: {
    captcha: string;
    captchaKey: string;
  };
  smsCaptchaLogin: {
    captcha: string;
    captchaKey: string;
  };
  forgotPassword: {
    captcha: string;
    captchaKey: string;
  };
}

export interface AuthModelType {
  namespace: string;
  state: AuthModelState;
  effects: {
    getCaptcha: Effect;
    getSmsCaptcha: Effect;
    login: Effect;
    logout: Effect;
    resetPassword: Effect;
  };
  reducers: {
    changeCaptcha: Reducer;
    saveLoginState: Reducer;
  };
}

const Model: AuthModelType = {
  namespace: 'auth',

  state: {
    passwordLogin: {
      captcha: '',
      captchaKey: '',
    },
    smsCaptchaLogin: {
      captcha: '',
      captchaKey: '',
    },
    forgotPassword: {
      captcha: '',
      captchaKey: '',
    },
  },

  effects: {
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(service.getCaptcha);
      const { type } = payload;
      let captcha = '';
      let captchaKey = '';
      if (okResponse(response)) {
        captcha = response.data.captcha.img;
        captchaKey = response.data.captcha.key;
      }
      yield put({
        type: 'changeCaptcha',
        payload: {
          type,
          captcha,
          captchaKey,
        },
      });
    },

    *getSmsCaptcha({ payload }, { call, put, select }) {
      const data = {
        mobileNumber: payload.mobileNumber,
        captcha: payload.captcha,
        captchaKey: yield select(({ auth }: { auth: AuthModelState }) => auth[payload.type].captchaKey),
      };
      const response = yield call(service.getSmsCaptcha, data);
      if (!okResponse(response)) {
        yield put({
          type: 'getCaptcha',
          payload: {
            type: 'smsCaptchaLogin',
          },
        });
      }
      return yield response;
    },

    *login({ payload }, { call, put, select }) {
      const { type } = payload;
      let data = {};
      if (type === 'passwordLogin') {
        data = {
          username: payload.username,
          password: payload.password,
          captcha: payload.captcha,
          captchaKey: yield select(({ auth }: { auth: AuthModelState }) => auth.passwordLogin.captchaKey),
        };
      } else if (type === 'smsCaptchaLogin') {
        data = {
          mobileNumber: payload.mobileNumber,
          smsCaptcha: payload.smsCaptcha,
        };
      } else {
        return yield;
      }

      const response = yield call(service[type], data);
      if (!okResponse(response)) {
        return yield put({
          type: 'getCaptcha',
          payload: {
            type,
          },
        });
      }

      yield put({
        type: 'saveLoginState',
        payload: {
          token: response.data.token,
        },
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params as { redirect: string };
      let query = {};
      if (redirect) {
        try {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirectUrlParams.pathname;
            query = parseQueryString(redirectUrlParams.search);
          } else {
            window.location.href = redirect;
            return yield;
          }
        } catch (e) {
          redirect = '';
        }
      }
      return yield router.push({
        pathname: redirect || '/',
        query,
      });
    },

    *logout({ payload }, { call }) {
      yield call(service.logout, payload);
      destroyToken();
      destroyRoles();
      destroyPermissions();
      reloadAuthorized();
      const { redirect } = payload;
      yield router.push({
        pathname: '/auth/login',
        query: {
          redirect,
        },
      });
    },

    *resetPassword({ payload }, { call, put }) {
      const response = yield call(service.resetPassword, payload);
      if (!okResponse(response)) {
        return yield put({
          type: 'getCaptcha',
          payload: {
            type: 'forgotPassword',
          },
        });
      }
      return yield window.location.reload();
    },
  },

  reducers: {
    changeCaptcha(state, { payload }) {
      const { type, captcha, captchaKey } = payload;
      return {
        ...state,
        [type]: {
          captcha,
          captchaKey,
        },
      };
    },

    saveLoginState(state, { payload }) {
      const { token } = payload;
      const tokenPayload: any = getTokenPayload(token);
      const { roles, permissions } = tokenPayload;
      storageToken(token);
      storageRoles(roles);
      storagePermissions(permissions);
      reloadAuthorized();
      return {
        ...state,
        roles: [...roles],
        permissions: [...permissions],
      };
    },
  },
};

export default Model;
