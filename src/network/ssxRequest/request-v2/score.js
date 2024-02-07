import { requestSsxV3 } from '@/network/ssxRequest/request.js'

export const getScoreV2 = (params) => {
    return requestSsxV3({
        url: '/score',
        method: 'POST',
        data: params,
        // params:params,
        // 接口使用json
        headers: {
            "Content-Type": "application/json"
        },
    })
}