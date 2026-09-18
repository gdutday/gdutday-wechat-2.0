// [ai-mode:static] 来自 src/modules/login/enum.js + src/network/enum.js

// 用户类型
const USER_TYPE = {
  undergraduate: 1,
  postgraduate: 2,
  teacher: 3,
}

// 登录类型
const LOGIN_TYPE = {
  loginV1: 1,
  loginV2: 2,
}

const DEFAULT_USER_TYPE = USER_TYPE.undergraduate
const DEFAULT_LOGIN_TYPE = LOGIN_TYPE.loginV2

const UG_V1 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV1}`
const PG_V2 = `${USER_TYPE.postgraduate}--${LOGIN_TYPE.loginV2}`
const UG_V2 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV2}`

const LOGIN_CONBINE_TYPE = {
  [UG_V1]: 1,
  [PG_V2]: 2,
  [UG_V2]: 3,
}

// 错误码
const REQUEST_CLIENT_ERROR = {
  VCODE_INPUT_ERROR: 4001,
  PARAMS_ERROR: 4002,
  LOGIN_TYPE_ERROR: 4003,
  LOGIN_ERROR: 4004,
  USERNAME_PSW_ERROR: 4005,
  SCHEDULE_ERROR: 4006,
  COOKIE_EXPIRED_ERROR: 4007,
  SCORE_ERROR: 4008,
  EXAM_ERROR: 4009,
  DATE_ERROR: 4010,
  VCODE_EXPIRED: 4011,
  COOKIE_EXPIRED_ERROR_V2: 4012,
}

const REQUEST_SERVER_ERROR = {
  COMMON_ERROR: 5001,
  DECODE_ERROR: 5002,
}

const FE_ERROR = {
  PG_NO_EXAM: 6001,
  USER_TYPE_ERROR: 6002,
}

const FE_MSG_MAP = {
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
  [REQUEST_CLIENT_ERROR.VCODE_EXPIRED]: '验证码错误',
  [REQUEST_CLIENT_ERROR.COOKIE_EXPIRED_ERROR_V2]: '身份信息过期，请重新登录！',
  [REQUEST_SERVER_ERROR.COMMON_ERROR]: '网络请求异常，请重试！',
  [REQUEST_SERVER_ERROR.DECODE_ERROR]: '内部服务解密异常，请稍后再试',
  [FE_ERROR.PG_NO_EXAM]: '研究生无成绩接口',
  [FE_ERROR.USER_TYPE_ERROR]: '登陆渠道错误：如「本科生」登陆了「研究生」渠道',
}

function getErrorMsgByCode(code) {
  code = code || REQUEST_SERVER_ERROR.COMMON_ERROR
  return FE_MSG_MAP[code] || '网络请求异常，请重试！'
}

module.exports = {
  USER_TYPE,
  LOGIN_TYPE,
  DEFAULT_USER_TYPE,
  DEFAULT_LOGIN_TYPE,
  UG_V1,
  PG_V2,
  UG_V2,
  LOGIN_CONBINE_TYPE,
  REQUEST_CLIENT_ERROR,
  REQUEST_SERVER_ERROR,
  FE_ERROR,
  FE_MSG_MAP,
  getErrorMsgByCode,
}
