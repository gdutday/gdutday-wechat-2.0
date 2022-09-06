<template>
  <view class="postion-bottom_center w-1 h-1 modal" @tap="closeModal">
    <SelectorControllor @close="closeModal"></SelectorControllor>
  </view>
</template>

<script>
import SelectorControllor from './SelectorController'
export default {
  components: {
    SelectorControllor,
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    return {
      closeModal,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
