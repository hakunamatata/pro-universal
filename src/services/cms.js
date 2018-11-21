import request from '@/utils/request'
export async function contentAdd(params) {
    return request('/api/cms/content/add',{
        method:'POST',
        body:{
            ...params,
            method:'post'
        }
    })
}

export async function categoryAdd(params){
     return request('/api/cms/category/create',{
         method:'POST',
         body:{
             ...params,
             method:'post'
         }
     })
}

export async function categoryList(params){
    return request('/api/cms/category/query',{
        method:'POST',
        body:{
            ...params,
            method:'post'
        }
    })
}

export async function contentList(params){
   return request('/api/cms/content/list',{
       method:'POST',
       body:{
           ...params,
           method:'post'
       }
   })
}