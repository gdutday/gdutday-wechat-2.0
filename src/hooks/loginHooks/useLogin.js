import { ref } from 'vue';
import useToast from '../toastHooks/useToast';
import * as LOGIN_ENUM from '@/modules/login/enum';
import { getStorageSync } from '@/utils/common.js'
import { loginV1, loginV2 } from '@/network/ssxRequest/request-v2/login';

export default function () {
    const {
        toastType,
        toastIsShow,
        resumeToastIsShow,
        inspireToastIsShow,
        warningInfo
    } = useToast

    const getCurrentLoginType = () => {
        return getStorageSync('loginType') || LOGIN_ENUM.DEFAULT_LOGIN_TYPE
    }

    const getCurrentUserType = () => {
        return getStorageSync('userType') || LOGIN_ENUM.DEFAULT_USER_TYPE
    }

    // combineType解析  
    const combineLoginTypeAction = (userType, loginType) => {
        const combineLoginType = [userType, loginType].join('--')
        return combineLoginType
    }

    // combineType解析
    const separateLoginTypeAction = (combineType) => {
        if (!combineType) {
            console.log('无combineType');
            return
        }
        const [userType, loginType] = combineType.split('--').map((item) => Number(item))

        return {
            userType, loginType
        }
    }

    const preLoginHandler = (params, combineLoginType) => {
        const { userType, loginType } = separateLoginTypeAction(combineLoginType)
        // 密码加密在此

        const { password } = params

        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1: {
                params = {
                    ...params,
                    userType,
                    loginType
                }
                break
            }
            case LOGIN_ENUM.PG_V2:
            case LOGIN_ENUM.UG_V2: {
                params = {
                    ...params,
                    userType,
                    loginType
                }
                break
            }
        }

        return params
    }

    // 登陆函数
    const login = (params) => {
        const userType = getCurrentUserType()
        const loginType = getCurrentLoginType()
        // 获取combineLiginType
        const combineLoginType = combineLoginTypeAction(userType, loginType)

        // 对params做一层封装
        params = preLoginHandler(params, combineLoginType)

        // v2全员采用此规范
        let reqFunc = loginV2
        let callback = null

        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1: {
                reqFunc = loginV2
                callback = (res) => {
                    const { jessionId } = res.data

                    return jessionId
                }
                break
            }
            case LOGIN_ENUM.PG_V2: {
                reqFunc = loginV2
                callback = (res) => {
                    const { weCookies } = res.data

                    return {
                        weCookies
                    }
                }
                break
            }
            case LOGIN_ENUM.UG_V2: {
                reqFunc = loginV2
                callback = (res) => {
                    const { weCookies } = res.data

                    return weCookies
                }
                break;
            }
            default: {

                console.log('error', '请求userType或者loginType不符合规范');
            }
        }

        return reqFunc(params).then((res) => callback(res)).catch((err) => {
            console.log('请求出错');
        })
    }


    return {
        login,
        getCurrentLoginType,
        getCurrentUserType,
        combineLoginTypeAction,
        separateLoginTypeAction
    }
}