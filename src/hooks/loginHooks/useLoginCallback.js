import { onMounted, onUnmounted, ref } from "vue"
import Bus from '@/utils/bus'

const useLoginCallback = () => {
    const loginCallback = ref(null)

    const updateLoginCallback = (newFunc) => {
        loginCallback.value = newFunc
    }

    onMounted(() => {
        Bus.on('login', loginCallback.value)
    })

    onUnmounted(() => {
        Bus.off('login', loginCallback.value)
    })

    return {
        updateLoginCallback
    }
}

export default useLoginCallback