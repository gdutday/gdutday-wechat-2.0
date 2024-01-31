// 用户类型
export const USER_TYPE = {
    undergraduate: 1, // 本科生
    postgraduate: 2, // 研究生
    teacher: 3 // 教师端
}

// 登陆类型
export const LOGIN_TYPE = {
    loginV1: 1, // 教务系统
    loginV2: 2, // 统一认证
}

export const DEFAULT_USER_TYPE = USER_TYPE.undergraduate
export const DEFAULT_LOGIN_TYPE = LOGIN_TYPE.loginV2

export const UG_V1 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV1}`
export const PG_V2 = `${USER_TYPE.postgraduate}--${LOGIN_TYPE.loginV2}`
export const UG_V2 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV2}`

// 组合类型（组合userType和LoginType）
export const LOGIN_CONBINE_TYPE = {
    [UG_V1]: 1, // 本科生 教务系统
    [PG_V2]: 2, // 研究生 统一认证
    [UG_V2]: 3, // 本科生 统一认证
}

