import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'

export function postQianXun(params){
  return requestSsx({
    url:ssxAPIs.qianxunPostAPI,
    method:'POST',
    data:params
  })
}


export function postPageLimit(params){
  console.log(params);
  return requestSsx({

    url:ssxAPIs.qianxunPostPageLimitAPI + '?page='+params.page+'&limit='+params.limit+'&type='+params.type
  })
}

export function getSpecialPost(id){
  return requestSsx({
    url:ssxAPIs.qianxunGetOneTextAPI+'?id='+id
  })
}