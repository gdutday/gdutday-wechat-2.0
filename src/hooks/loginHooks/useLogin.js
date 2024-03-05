import * as LOGIN_ENUM from '@/modules/login/enum';
import {getStorageSync, graduteEncoding} from '@/utils/common.js'
import {loginV2} from '@/network/ssxRequest/request-v2/login';
import {useStore} from 'vuex';
import {getErrorMsgByCode} from '../../utils/reqErrorMsgUtil';
import {FE_ERROR} from '../../network/enum';

export default function () {
    const store = useStore()

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

        const {user = '', password = ''} = params

        // 缓存
        user && uni.setStorageSync('username', user)
        password && uni.setStorageSync('password', password)

        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1:
            case LOGIN_ENUM.PG_V2:
            case LOGIN_ENUM.UG_V2: {
                const encodedPassword = graduteEncoding(user, password)

                params = {
                    ...params,
                    password: encodedPassword,
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

                    uni.hideLoading()

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

                    uni.hideLoading()

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

                    uni.hideLoading()

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

        uni.showLoading({title: '正在登陆中'})

        return reqFunc(params).then((res) => {
            // 登陆与响应结果不一致
            const [isError, data] = res

            console.log('commonRes', res);


            if (isError) {
                const msg = getErrorMsgByCode(data.code)

                throw {
                    code: data.code,
                    msg
                }
            } else {
                // FE判断userType是否符合要求
                if (data?.data?.userType !== params?.userType) {
                    throw {
                        code: FE_ERROR.USER_TYPE_ERROR,
                        msg: getErrorMsgByCode(FE_ERROR.USER_TYPE_ERROR)
                    }
                }
            }

            if (data.code === 200) {
                store.commit('common/setIsLogin', {
                    isLogin: true
                })
            }

            console.log('isLogin?', data);
            return callback(data)
        }).catch((err) => {
            console.log('请求出错', err);
            uni.hideLoading()

            return [true, err]
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