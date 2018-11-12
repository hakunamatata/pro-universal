import {
    query,
} from '@/services/role';


export default {
    namespace: 'role',

    state: {
        list: [],
    },

    effects: {
        *query({ payload, callback }, { call, put }) {
            const response = yield call(query, payload);
            
            yield put({
                type: 'list',
                payload: Array.isArray(response) ? response : [],
            });
            if (callback) yield call(callback, response);
            
        },
        
    },
    

    reducers: {
        list(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
    },
};
