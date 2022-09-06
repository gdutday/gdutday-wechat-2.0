<template>
  <view class="w-1 h-1 position-relative">
    <view
      class="simple-button position-absolute button-shadow"
      :key="themeColor.curBg"
      :class="[
        show ? 'animation-fade depth-8' : '',
        'h-1',
        'w-1',
        'flex-center',
        type == 'refresh' && show ? 'spanRotate ' : '',
      ]"
      @touchstart="handleTap"
      @touchend="stopTap"
      @tap="handleTap"
      :style="{
        backgroundColor: themeColor.curBg,
        color: themeColor.curTextC,
      }"
    >
      <text v-if="type == 'default'">{{ value }}</text>
      <text v-else-if="type == 'totop'" class="iconfont icon-icon-test41"></text>
      <text v-else-if="type == 'refresh'" class="iconfont icon-icon-test22"></text>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    value: {
      type: String,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let show = ref(false)

    const handleTap = () => (show.value = true)

    const stopTap = () => (show.value = false)

    return {
      handleTap,
      show,
      stopTap,
    }
  },
}
</script>

<style lang="scss" scoped>
.simple-button {
  border-radius: 40px;
  top: 0;
}

.iconfont {
  font-size: 1.5rem;
}
</style>
