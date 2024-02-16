import {computed, ref} from 'vue';
import {getStorageSync} from "@/utils/common.js";
const useLoginChooser = () => {
    // 查看当前选中的是哪一档
    const loginType = ref(+getStorageSync("loginType"));
    const userType = ref(+getStorageSync("userType"));

    const setChooser = (userTypeParam, loginTypeParam) => {
        uni.setStorageSync("userType", userTypeParam);
        uni.setStorageSync("loginType", loginTypeParam);
        userType.value = userTypeParam;
        loginType.value = loginTypeParam;
    }

    const loginChooserContent = ref([
        {
            icon: '本',
            content: '本科生',
            loginPath: '统一认证',
            onclick: () => setChooser(1, 2),
            userType: 1,
            loginType: 2,
            isActive: computed(() => {
                return userType.value === 1 && loginType.value === 2
            })
        }, {
            icon: '本',
            content: '本科生',
            onclick: () => setChooser(1, 1),
            loginPath: '教务系统',
            userType: 1,
            loginType: 1,
            isActive: computed(() => {
                return userType.value === 1 && loginType.value === 1
            })
        }, {
            icon: '硕',
            content: '研究生',
            loginPath: '统一认证',
            onclick: () => setChooser(2, 2),
            userType: 2,
            loginType: 2,
            isActive: computed(() => {
                return userType.value === 2 && loginType.value === 2
            })
        }])

    return {
        loginChooserContent,
        setChooser,
        userType,
        loginType
    }
}

export default useLoginChooser