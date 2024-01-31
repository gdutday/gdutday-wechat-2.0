import { requestSsxV3, requestSsx } from '@/network/ssxRequest/request.js'
import { stuLogin } from '../ssxInfo/scheduleInfo'
export const loginV2 = (params) => {
    return requestSsxV3({
        url: '/login',
        method: 'POST',
        data: params,
        // params:params,
        // 接口使用json
        headers: {
            "Content-Type": "application/json"
        },
    })
}

// 教务系统登陆专属接口
export const sendVerV2 = () => {
    return requestSsxV3({
        url: '/sendVer',
        method: 'GET',
        data: params,
        // params:params,
        // 接口使用json
        headers: {
            "Content-Type": "application/json"
        },
    }) 
}