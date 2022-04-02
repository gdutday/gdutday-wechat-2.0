import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'

export function postQianXun(params){
  return requestSsx({
    url:ssxAPIs.qianxunPostAPI,
    method:'POST',
    data:params
  })
}
export function getKeywordSearch(params, keyword){
  console.log(params);
  return requestSsx({

    url:ssxAPIs.qianxunGetPageLimitAPI + '?page='+params.page+'&limit='+params.limit+'&keyword='+keyword
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


export function getMyPosts(studentId){
  return requestSsx({
    url:ssxAPIs.qianxunGetMyPostAPI + studentId
  })
}
//删除帖子
export function getHidePost(postId){
  return requestSsx({
    url:ssxAPIs.qianxunGetHidePostAPI + postId
  })
}

//恢复帖子
export function getDisplayPost(postId){
  return requestSsx({
    url:ssxAPIs.qianxunGetDisplayPostAPI + postId
  })
}

export function postEditPost(params){
  return requestSsx({
    url:ssxAPIs.qianxunPostEditAPI,
    method:'POST',
    data:params
  })
}

