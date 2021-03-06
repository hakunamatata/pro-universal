import request from '@/utils/request';
import cookie from 'react-cookies';
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
  const token = cookie.load('token');
  return request('/api/user/currentUser', {
    method: 'POST',
    body: {
      token: cookie.load('token'),
      method: 'post',
    },
  });
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

export async function editUser(params) {
  return request('/api/user/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeUser(params) {
  return request('/api/user/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
