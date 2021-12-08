<template>
  <!-- 这个组件用于写select-week左边的标志一摁切换的动画效果 -->
  <view class="flex-center" @tap="isRotate = !isRotate">
    <text
      class="iconfont icon-icon-test38"
      :class="[isRotate ? 'spanRotate' : 'spanRotateReverse']"
    ></text>
  </view>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props, { emit }) {
    let isRotate = ref(false);

    return { isRotate };
  },
};
</script>

<style lang="scss" scoped>
</style>