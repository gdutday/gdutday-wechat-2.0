import {onMounted, onUnmounted, ref} from "vue"
import Bus from '@/utils/bus'

const useLoginCallback = () => {
    const loginCallback = ref(() => { })

    const updateLoginCallback = (newFunc) => {
        loginCallback.value = () => {
            console.log('进入callback');
            newFunc && newFunc()
        }
    }

    onMounted(() => {
        console.log('created');
        Bus.on('login', () => {
            loginCallback.value && loginCallback.value()
        })
    })

    onUnmounted(() => {
        console.log('onUnmounted');
        Bus.off('login')
    })

    return {
        updateLoginCallback
    }
}

export default useLoginCallback