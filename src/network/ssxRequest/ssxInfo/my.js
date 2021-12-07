import { requestSsx } from '../request';
import { ssxAPIs } from '@/api/API.js'


export function postFeedbackInfo(params){
  return requestSsx({
    url:ssxAPIs.feedbackAPI,
    method:'POST',
    params:params
  })
}