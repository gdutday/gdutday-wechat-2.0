import { requestSsxV3 } from '@/network/ssxRequest/request.js'

export const getCetScore = (params) => {
    return requestSsxV3({
        url: '/cetScore',
        method: 'POST',
        data: params,
        headers: {
            "Content-Type": "application/json"
        },
    })
}
