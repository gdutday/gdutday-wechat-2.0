import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'


export function getNewsInfo(page=1,limit=8){
  return requestSsx({
    url:ssxAPIs.newsAPI+'?pageCountStr='+page+'&limitCountStr='+limit,
  })
}

export function searchNewsInfo(keyvalue,limit=8){
  return requestSsx({
    url:ssxAPIs.searchNewsAPI+keyvalue+'&limitCountStr='+limit
  })
}
