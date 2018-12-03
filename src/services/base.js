import { stringify } from 'qs';
import request from '@/utils/request';

export async function add(params) {
  return request('/api/base/dictionary/category', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function save(params) {
  return request('/api/base/dictionary/category', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}

export async function remove(params) {
  return request('/api/base/dictionary/category', {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function category(params) {
  return request('/api/base/dictionary/category', {
    method: 'GET',
    body: params,
  });
}
