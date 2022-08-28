import { ssxAPIs } from '@/api/API.js'
import { requestSsx } from '../request'

export const getJavaGodShensixie = (stuid, jSessionId, width = '200', height = '200') => {
  return requestSsx({
    url: ssxAPIs.libarayQRCodeAPI + `?stuId=${stuid}&widthStr=${width}&heightStr=${height}&jSessionId=${jSessionId}`,
  })
}
