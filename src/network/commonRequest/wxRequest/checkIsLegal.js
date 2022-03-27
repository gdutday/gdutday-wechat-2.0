import { wxAPIs } from "@/api/API";
import { request } from "../request";

const APPID = 'wxf6b4a3f7411a737c'
const APPSECRECT = 'c0073ed4e74da00a99538c8101b4c44d'

export function getAccessToken(){
  return request({
    url:wxAPIs.getAccessTokenAPI + `&appid=${APPID}&secret=${APPSECRECT}`
  })
}

export function justifyContentIsLegal({access_token, content}){
  return request({
    url:wxAPIs.justifyContentIsLegal + 'access_token' + access_token + '&content='+JSON.stringify(content)
  })
}