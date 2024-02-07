import { ref } from 'vue';
import useToast from '../toastHooks/useToast';
import useLogin from '../loginHooks/useLogin';
import {loginV2, sendVerV2}from '@/network/ssxRequest/request-v2/login.js'
import {getScoreV2} from '@/network/ssxRequest/request-v2/score.js'
import { getExaminationV2 } from '@/network/ssxRequest/request-v2/examination';
import { getStorageSync } from '@/utils/common.js'
import { getScheduleV2 } from '@/network/ssxRequest/request-v2/schedule.js'
import * as LOGIN_ENUM from '@/modules/login/enum';

export default function () {
    const {
        toastType,
        toastIsShow,
        resumeToastIsShow,
        inspireToastIsShow,
        warningInfo
    } = useToast()

    const {
        login,
        getCurrentLoginType,
        getCurrentUserType,
        combineLoginTypeAction,
        separateLoginTypeAction
    } = useLogin()

    const preCommonRequestHandler = (params = {}) => {
        const userType = getCurrentUserType()
        const loginType = getCurrentLoginType()
        const combineLoginType = combineLoginTypeAction(userType, loginType)
        let tmp = {
            ...params,
            userType,
            loginType
        }

        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1: {
                // 做一层处理
            }
            case LOGIN_ENUM.PG_V2:
            case LOGIN_ENUM.UG_V2: {
                tmp = {
                    ...tmp,
                    cookies: getStorageSync('weCookies'),
                    termId: "20241"
                }
                break
            }
        }

        return tmp
    }

    const commonRequest = (fn) => {
        // 处理一部分
        return async (params) => {
            params = params || {}
            params = preCommonRequestHandler(params)
            console.log('params', params);
            return fn(params)
        }
    }

    // 根据userLoginType决定到底采用哪个函数(在外部进行组合)
    const getSchedule = commonRequest(async (params) => {
        const combineLoginType = combineLoginTypeAction(getCurrentUserType(),getCurrentLoginType())
        // 1. 做一些params加强的操作
        
        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1: {
                const result = await getScheduleV2(params)
                // 做一层处理

                return [false, {
                    data: result
                }]
            }
            case LOGIN_ENUM.PG_V2:
            case LOGIN_ENUM.UG_V2: {
                console.log('进入了');
                const result = await getScheduleV2(params)

                return [false, {
                    data: result
                }]
            }
        }

        return [true]
    })
    

    //
    const getExam = commonRequest(async (params) => {
        const result = await getExaminationV2(params)
    })

    const getGrade = commonRequest(async (params) => {
        const result = await getScoreV2(params)
    })

    const getVerV2 = async () => {
        const res = await sendVerV2()

        if(!res.data) {
            return [true, {
                msg: '响应无data'
            }]
        }
         
        const {jsessionId, verCode} = res.data || {}

        if(jsessionId) {
            uni.setStorageSync('jsessionId', jsessionId)
            console.log('jessionId', jsessionId);
        }

        if(verCode) {
            console.log('verCode', verCode);
        }
        
        return [false, {
            data: {
                jsessionId,
                verCode
            }
        }]
    }



    return {
        getExam,
        getGrade,
        getVerV2,
        getSchedule
    }
}