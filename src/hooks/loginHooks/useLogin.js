import {ref} from 'vue';
import useToast from '../toastHooks/useToast';
import * as LOGIN_ENUM from '@/modules/login/enum';
import {getStorageSync, encoding} from '@/utils/common.js'
import {loginV2} from '@/network/ssxRequest/request-v2/login';
import {useStore} from 'vuex';


export default function () {
    const store = useStore()
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

    const preLoginHandler = (params = {}, combineLoginType) => {
        const {userType, loginType} = separateLoginTypeAction(combineLoginType)
        // 密码加密在此


        switch (combineLoginType) {

            case LOGIN_ENUM.UG_V1: {
                const {password, code} = params

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
    const login = async (params) => {
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
                console.log('本科生 教务系统');

                reqFunc = loginV2
                callback = (res) => {
                    const {weCookies} = res.data

                    uni.setStorageSync('weCookies', weCookies)


                    return [false, {
                        data: weCookies
                    }]
                }
                break
            }
            case LOGIN_ENUM.PG_V2: {
                console.log('研究生 统一认证');

                reqFunc = loginV2
                callback = (res) => {
                    const {weCookies} = res.data

                    uni.setStorageSync('weCookies', weCookies)

                    console.log('weCookies', 'weCookies', weCookies);

                    return [false, {
                        data: weCookies
                    }]
                }
                break
            }
            case LOGIN_ENUM.UG_V2: {
                console.log('本科生 统一认证');

                reqFunc = loginV2
                callback = (res) => {
                    const {weCookies, campus, userType} = res.data

                    uni.setStorageSync('weCookies', weCookies)

                    console.log('weCookies', 'weCookies', weCookies);


                    return [false, {
                        data: weCookies
                    }]
                }
                break;
            }
            default: {

                console.log('error', '请求userType或者loginType不符合规范');
            }
        }



        return reqFunc(params).then((res) => {
            if (res.code === 200) {
                store.commit('common/setIsLogin', {
                    isLogin: true
                })

                uni.setStorageSync('username', params.user)
                uni.setStorageSync('password', params.password)
            }
            if (res.code === 500) {
                throw {
                    code: 500,
                    msg: '账号或密码错误'
                }
            }
            console.log('isLogin?', res);
            return callback(res)
        }).catch((err) => {
            console.log('请求出错');
            return [
                true,
                {
                    code: err.code || 500,
                    msg: err.msg || '账号或密码错误'
                }
            ]
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