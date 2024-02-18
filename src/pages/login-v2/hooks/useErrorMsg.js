import { ref } from "vue"

const useErrorMsg = () => {
    const errorMsg = ref('')

    const setErrorMsg = (msg) => {
        errorMsg.value = msg
    }

    const initErrorMsg = () => {
        errorMsg.value = ''
    }

    return {
        errorMsg,
        initErrorMsg,
        setErrorMsg
    }
}

export default useErrorMsg