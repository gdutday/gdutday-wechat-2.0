import {computed, ref} from 'vue';
import {getStorageSync} from "@/utils/common.js";

const useLoginParams = () => {
    const username = ref(getStorageSync('userName'))
    const password = ref(getStorageSync('userName'))
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