import { contentAdd, categoryAdd, categoryList, contentList } from '@/services/cms';
export default {
    namespace: 'cms',
    state: {
        catelist: [],
        contentList: []
    },

    effects: {
        *addContent({ payload, callback }, { call, put }) {
            const response = yield call(contentAdd, payload);
            if (callback) yield call(callback, response)
        },
        *addCategory({ payload, callback }, { call, put }) {
            const response = yield call(categoryAdd, payload);
            if (callback) yield callback(callback,response);
        },
        *cateList({ payload, callback }, { call, put }) {
            const response = yield call(categoryList, payload)
            console.log('res',response);
            if(response.err==null){
                yield put({
                    type: 'categroylist',
                    payload: response
                })
            }
        },
        *contlist({ payload, callback }, { call, put }) {
            const response = yield call(contentList, payload);
            
            yield put({
                type: 'list',
                payload: Array.isArray(response) ? response : []
            })
        }
    },

    reducers: {
        categroylist(state, action) {
            return {
                ...state,
                catelist: action.payload
            }
        },
        list(state, action) {
            return {
                ...state,
                contentList: action.payload
            }
        }
    }
}