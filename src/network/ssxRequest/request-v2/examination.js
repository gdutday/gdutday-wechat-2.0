import { requestSsxV3 } from '@/network/ssxRequest/request.js'

export const getExaminationV2 = (params) => {
    return requestSsxV3({
        url: '/examination',
        method: 'GET',
        data: params,
        // params:params,
        // 接口使用json
        headers: {
            "Content-Type": "application/json"
        },
    })
}