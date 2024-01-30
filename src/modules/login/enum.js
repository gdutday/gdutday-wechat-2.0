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

const LOGIN_CONBINE_TYPE_1 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV1}`
const LOGIN_CONBINE_TYPE_2 = `${USER_TYPE.postgraduate}--${LOGIN_TYPE.loginV2}`
const LOGIN_CONBINE_TYPE_3 = `${USER_TYPE.undergraduate}--${LOGIN_TYPE.loginV2}`

// 组合类型（组合userType和LoginType）
export const LOGIN_CONBINE_TYPE = {
    [LOGIN_CONBINE_TYPE_1]: 1, // 本科生 教务系统
    [LOGIN_CONBINE_TYPE_2]: 2, // 研究生 统一认证
    [LOGIN_CONBINE_TYPE_3]: 3, // 本科生 统一认证
}

