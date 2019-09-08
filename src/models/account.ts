import * as service from '@/services/account';

import { Effect } from 'dva';
import { Profile } from '@/services/schemas';
import { Reducer } from 'redux';
import { okResponse } from '@/utils/utils';

export interface AccountModelState {
  profile?: Profile;
}

export interface AccountModelType {
  namespace: string;
  state: AccountModelState;
  effects: {
    getProfile: Effect;
  };
  reducers: {
    saveProfile: Reducer;
  };
}

const Model: AccountModelType = {
  namespace: 'account',

  state: {},

  effects: {
    *getProfile(_, { call, put }) {
      const response = yield call(service.getProfile);
      if (!okResponse(response)) {
        return;
      }
      yield put({
        type: 'saveProfile',
        payload: response.data || undefined,
      });
    },
  },

  reducers: {
    saveProfile(state, { payload }) {
      return {
        ...state,
        profile: {
          ...payload,
          notificationCount: 0,
        },
      };
    },
  },
};

export default Model;
