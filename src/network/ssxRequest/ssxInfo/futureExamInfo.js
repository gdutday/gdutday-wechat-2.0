import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'

export function getFutureExamInfo(session){
  return requestSsx({
    url:ssxAPIs.futureExamAPI+session,
  })
}