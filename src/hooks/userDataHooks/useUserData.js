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

    const {getCurrentLoginType} = useLogin()

    // 根据userLoginType决定到底采用哪个函数(在外部进行组合)
    const getSchedule = () => {
        const userLoginType = getCurrentLoginType()
        switch(userLoginType) {
        }
    }

    //
    const getExam = () => {
        const userLoginType = getCurrentLoginType()
        switch(userLoginType) {
        }
    }

    const getGrade = () => {
        const userLoginType = getCurrentLoginType()
        switch(userLoginType) {
        }
    }

    return {
        getSchedule,
        getExam,
        getGrade
    }
}