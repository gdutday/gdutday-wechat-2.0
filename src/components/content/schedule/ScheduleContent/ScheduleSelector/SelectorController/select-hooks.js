import { ref } from 'vue'

export default () => {
  const isAllSelected = ref(false)
  const changeSelected = (success, notSuccess) => {
    isAllSelected.value = !isAllSelected.value
    console.log(isAllSelected.value)
    if (isAllSelected.value) {
      success && success()
    } else {
      notSuccess && notSuccess()
    }
  }

  return {
    isAllSelected,
    changeSelected,
  }
}
