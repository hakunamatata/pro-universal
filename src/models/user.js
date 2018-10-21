import { 
    query as queryUsers, 
    queryCurrent,
    createUser
} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 创建用户
    *create({ payload, callback }, { call, put }) {
        const response = yield call(createUser, payload);
        yield put({
          type: 'createdResult',
          payload: response,
        });
        if (callback) callback();
      },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
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
    // 用户创建结果
    createdResult(state, action){
        return {
            ...state,
            result: action.payload
        }
    }
  },
};
