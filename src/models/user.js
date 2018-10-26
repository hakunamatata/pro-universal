import {
    query as queryUsers,
    queryUser,
    queryCurrent,
    createUser,
    editUser
} from '@/services/user';

export default {
    namespace: 'user',

    state: {
        currentUser: {},
        detail: {},
        sysList: {
            list: [],
            pagination: {}
        },
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
            if (callback) yield callback(response);
        },

        *edit({ payload, callback }, { call, put }) {
            console.log(payload);
            const response = yield call(editUser, payload);
            console.log(response);
            if (callback) yield call(callback);
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
            yield put({
                type: 'saveDetail',
                payload: response,
            });
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                sysList: action.payload
            };
        },
        saveDetail(state, action) {
            return {
                ...state,
                detail: action.payload
            }
        },
        add(state, action) {
            let { list, pagination } = state.data;
            return {
                ...state,
                sysList: { list: [action.payload.data, ...list], pagination },
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
