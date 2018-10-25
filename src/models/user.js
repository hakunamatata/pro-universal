import { query as queryUsers, queryUser, queryCurrent, createUser } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 创建用户
    *create({ payload, callback }, { call, put }) {
      const response = yield call(createUser, payload);
      if (response.err_code == null)
        yield put({
          type: 'add',
          payload: response,
        });
      if (callback) callback(response);
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchUser({ payload, callback }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (response.err_code == null)
        yield put({
          type: 'save',
          payload: response,
        });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    add(state, action) {
      let { list, pagination } = state.data;
      return {
        ...state,
        data: { list: [action.payload.data, ...list], pagination },
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
