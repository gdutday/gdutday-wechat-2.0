/*
 * @Date: 2022-10-21 21:40:26
 * @LastEditors: zhang-mingyuan123 2369558390@qq.com
 * @LastEditTime: 2022-10-21 21:43:33
 * @FilePath: \GDUTDays-wechat\gdutday-wechat-2.0\src\network\ssxRequest\ssxInfo\recruit.js
 * @description: none
 */
import { ssxAPIs } from '@/api/API'
import { requestSsx } from '../request'

export function getRecruitInfo() {
  return requestSsx({
    url: ssxAPIs.recruitMessageAPI,
  })
}
