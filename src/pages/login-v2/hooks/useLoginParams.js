import {computed, ref} from 'vue';
import {getStorageSync} from "@/utils/common.js";

const useLoginParams = () => {
    const username = ref(getStorageSync('username'))
    const password = ref(getStorageSync('password'))
    const vCodePic = ref('')
    const vCodeValue = ref('')

    return {
        username,
        password,
        vCodePic,
        vCodeValue,
    }
}

export default useLoginParams