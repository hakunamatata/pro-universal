import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function createUser(params){
    return request('/api/user/create', {
        method: 'POST',
        body: {
          ...params,
          method: 'post',
        }
    });
}