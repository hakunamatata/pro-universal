import request from '@/utils/request';

export async function query(params) {
    return request('/api/role/query', {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  }

  export async function add(params){
       return request('/api/role/add',{
          method:'POST',
          body:{
             ...params,
             method:'post'
          }
       })
  }
