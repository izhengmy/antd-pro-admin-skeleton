import * as service from '@/services/app';

import { parse, stringify } from 'qs';

import { ConnectState } from './connect.d';
import { Effect } from 'dva';
import { Menu } from '@/services/schemas';
import { MenuDataItem } from '@ant-design/pro-layout';
import { NoticeIconData } from '@/components/NoticeIcon';
import { Reducer } from 'redux';
import { getToken } from '@/utils/jwtToken';
import { okResponse } from '@/utils/utils';
import { queryNotices } from '@/services/user';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  menus: MenuDataItem[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    getMenus: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveMenus: Reducer;
  };
}

const formatMenus = (menus: Menu[]): MenuDataItem[] =>
  menus.map(
    (item: Menu): MenuDataItem => {
      const newItem: MenuDataItem = {
        path: item.path,
        name: item.name,
      };
      if (item.icon) {
        newItem.icon = item.icon;
      }
      if (item.newWindow) {
        newItem.target = '_blank';
        const url = new URL(item.path);
        const query = parse(url.search.split('?')[1]);
        if ('token' in query) {
          query.token = getToken();
          newItem.path = `${url.origin}${url.pathname}?${stringify(query)}`;
        }
      }
      if (item.children) {
        newItem.children = formatMenus(item.children);
      }
      return newItem;
    },
  );

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menus: [],
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *getMenus(_, { call, put }) {
      const response = yield call(service.getMenus);
      const menus = okResponse(response) ? response.data.menus : [];
      yield put({
        type: 'saveMenus',
        payload: formatMenus(menus),
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { notices: [], collapsed: true, menus: [] }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = { notices: [], collapsed: true, menus: [] }, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state = { notices: [], collapsed: true, menus: [] }, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
    saveMenus(state, { payload }) {
      return {
        ...state,
        menus: payload || [],
      };
    },
  },
};

export default GlobalModel;
