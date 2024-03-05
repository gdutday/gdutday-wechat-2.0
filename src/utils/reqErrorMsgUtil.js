import { FE_MSG_MAP, REQUEST_SERVER_ERROR } from "@/network/enum"

// 默认err code
const DEFAULT_ERROR_CODE = REQUEST_SERVER_ERROR.COMMON_ERROR

// 根据code映射msg
export const getErrorMsgByCode = (code) => {
    code = code || DEFAULT_ERROR_CODE
    
    const msg = FE_MSG_MAP[code] || '网络请求异常，请重试！'

    return msg
}