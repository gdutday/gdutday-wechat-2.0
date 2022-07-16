import { wxAPIs } from '@/api/API'
import { request } from '../request'

const APPID = ''
const APPSECRECT = ''

export function getAccessToken() {
  return request({
    url: wxAPIs.getAccessTokenAPI + `&appid=${APPID}&secret=${APPSECRECT}`,
  })
}

export function justifyContentIsLegal({ access_token, content }) {
  return request({
    url: wxAPIs.justifyContentIsLegal + 'access_token' + access_token + '&content=' + JSON.stringify(content),
  })
}
