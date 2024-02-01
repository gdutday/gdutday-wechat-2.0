import { ref } from 'vue';
import useToast from '../toastHooks/useToast';
import useLogin from '../loginHooks/useLogin';
import {loginV2, sendVerV2}from '@/network/ssxRequest/request-v2/login.js'
import {getScoreV2} from '@/network/ssxRequest/request-v2/score.js'
import { getExaminationV2 } from '@/network/ssxRequest/request-v2/examination';

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

    const preCommonRequestHandler = (params, combineLoginType) => {
        let tmp = {
            ...params,
            userType,
            loginType
        }

        return tmp
    }

    
    const commonRequest = (request) => {
        return (params) => {
            const combineLoginType = combineLoginTypeAction(getCurrentLoginType(), getCurrentUserType())

            params = preCommonRequestHandler(params, combineLoginType)

            return request(params).then((res) => {
                if(res.code === 5000) {
                    // 唤起登陆界面
                    // 登陆后，缓存对应的function进行触发
                }
            }).catch((err) => {

            })
        }

    }

    // 根据userLoginType决定到底采用哪个函数(在外部进行组合)
    const getSchedule = commonRequest(async (params) => {

        switch (combineLoginType) {
            case LOGIN_ENUM.UG_V1: {
                const result = await loginV2()
                // 做一层处理
            }
            case LOGIN_ENUM.PG_V2:
            case LOGIN_ENUM.UG_V2: {
                
                const result = await loginV2()

                break
            }
        }
    })

    //
    const getExam = commonRequest(async (params) => {
        const result = await getExaminationV2()
    })

    const getGrade = commonRequest(async (params) => {
        const result = await getScoreV2()
    })

    const getVerV2 = async () => {
        const result = await sendVerV2()
    }



    return {
        getSchedule,
        getExam,
        getGrade,
        getVerV2
    }
}