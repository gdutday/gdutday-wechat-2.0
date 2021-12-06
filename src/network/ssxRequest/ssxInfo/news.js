import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'


export function getNews(page=1,limit=8){
  return requestSsx({
    url:ssxAPIs.newsAPI+'?pageCount='+page+'&limitCount='+limit,
  })
}