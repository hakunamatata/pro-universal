import { add, category, save, remove } from '@/services/base';

export default {
  namespace: 'base',

  state: {
    dictionary: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(category, payload);
      yield put({
        type: 'saveCategory',
        payload: response || {},
      });
      if (callback) yield call(callback, response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if (callback) yield call(callback, response);
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(save, payload);
      if (callback) yield call(callback, response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if (callback) yield call(callback, response);
    },
  },

  reducers: {
    saveCategory(state, action) {
      return {
        ...state,
        dictionary: action.payload,
      };
    },
  },
};
