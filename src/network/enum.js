export const COMMON_ERROR = {
    NETWORK_ERROR: 500, // 网络请求异常，请稍后再试
    PROXY_ERROR: 403,   // 网络请求异常，请检查网络代理是否关闭
}

export const REQUEST_CLIENT_ERROR = {
    VCODE_INPUT_ERROR: 4001, // 请求验证码失败，请重试！
    PARAMS_ERROR: 4002, // 请检查请求参数
    LOGIN_TYPE_ERROR: 4003, // 登录类型错误！
    LOGIN_ERROR: 4004, // 登录异常，请重新登录！（出现风控页面） 
    USERNAME_PSW_ERROR: 4005, // 账号或密码错误 
    SCHEDULE_ERROR: 4006, // 请求课表异常，请重试！(请求页面出现问题) 
    COOKIE_EXPIRED_ERROR: 4007, // 身份信息过期，请重新登录！
    SCORE_ERROR: 4008, // 请求成绩异常，请重试！
    EXAM_ERROR: 4009, // 请求考试安排异常，请重试！
    DATE_ERROR:4010, // 修改课程格式错误
    VCODE_EXPIRED: 4011, // 验证码过期
}

export const REQUEST_SERVER_ERROR = {
    COMMON_ERROR: 5001, // 网络请求异常，请重试！(内部处理出现例如IO异常的等未知异常,统一回复) 
    DECODE_ERROR: 5002 // Internal server error!（解密异常）
}

export const FE_ERROR = {
    PG_NO_EXAM: 6001, // 研究生无成绩接口
}

export const FE_MSG_MAP = {
    // 400
    [REQUEST_CLIENT_ERROR.VCODE_INPUT_ERROR]: '请求验证码失败，请重试！',
    [REQUEST_CLIENT_ERROR.PARAMS_ERROR]: '请检查请求参数',
    [REQUEST_CLIENT_ERROR.LOGIN_TYPE_ERROR]: '登录类型错误！',
    [REQUEST_CLIENT_ERROR.LOGIN_ERROR]: '登录异常，请重新登录！',
    [REQUEST_CLIENT_ERROR.USERNAME_PSW_ERROR]: '账号或密码错误',
    [REQUEST_CLIENT_ERROR.SCHEDULE_ERROR]: '请求课表异常，请重试！',
    [REQUEST_CLIENT_ERROR.COOKIE_EXPIRED_ERROR]: '身份信息过期，请重新登录！',
    [REQUEST_CLIENT_ERROR.SCORE_ERROR]: '请求成绩异常，请重试！',
    [REQUEST_CLIENT_ERROR.EXAM_ERROR]: '请求考试安排异常，请重试！',
    [REQUEST_CLIENT_ERROR.DATE_ERROR]: '修改课程格式错误',
    [REQUEST_CLIENT_ERROR.VCODE_EXPIRED]: '验证码过期',

    // 500
    [REQUEST_SERVER_ERROR.COMMON_ERROR]: '网络请求异常，请重试！',
    [REQUEST_SERVER_ERROR.DECODE_ERROR]: '内部服务解密异常，请稍后再试',

    // FE
    [FE_ERROR.PG_NO_EXAM]: '研究生无成绩接口',

    // DEFAULT
    [COMMON_ERROR.NETWORK_ERROR]: '网络请求异常，请稍后再试',
    [COMMON_ERROR.PROXY_ERROR]: '网络请求异常，请检查网络代理是否关闭',
    
}