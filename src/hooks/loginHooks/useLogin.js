import { ref } from 'vue';
import useToast from '../toastHooks/useToast';
import { LOGIN_CONBINE_TYPE } from '@/modules/login/enum';

export default function () {
    const {
        toastType,
        toastIsShow,
        resumeToastIsShow,
        inspireToastIsShow,
        warningInfo
    } = useToast

    const getCurrentLoginType = () => {
        
    }

    const getCurrentUserType = () => {

    }

    // combineType解析
    const combineLoginTypeAction = (userType, loginType) => {
        const combineLoginType = [userType, loginType].join('-')
        return combineLoginType
    }

    // combineType解析
    const separateLoginTypeAction = (combineType) => {
        if(!combineType) {
            console.log('无combineType');
            return 
        }
        const [userType, loginType] = combineType.split('--')

        return {
            userType, loginType
        }
    }

    // 登陆函数
    const login = () => {
        const userType = getCurrentUserType()
        const loginType = getCurrentLoginType()
        const combineLoginType = combineLoginTypeAction(userType, loginType)

        switch (combineLoginType) {
            case LOGIN_CONBINE_TYPE:
        }
    }


    return {
        login,
        getCurrentLoginType
    }
}