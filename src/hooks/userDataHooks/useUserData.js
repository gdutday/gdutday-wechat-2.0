import { ref } from 'vue';
import useToast from '../toastHooks/useToast';
import useLogin from '../loginHooks/useLogin';


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
        
    })

    //
    const getExam = commonRequest(async (params) => {
        
    })

    const getGrade = commonRequest(async (params) => {
        
    })

    return {
        getSchedule,
        getExam,
        getGrade
    }
}