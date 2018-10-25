import request from '@/utils/request';

export async function query(params) {
  return request('/api/user/list', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function createUser(params) {
  return request('/api/user/create', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryUser(params) {
  return request('/api/user/get', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
