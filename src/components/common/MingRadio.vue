<template>
  <view @tap.stop="tap" style="padding: 5px; overflow: hidden" class="ripple round">
    <view class="radio round inner" :style="borderColor">
      <view :style="bgColor" :class="checked ? 'checked' : ''" class="radioRipple" />
    </view>
  </view>
</template>

<script>
import { computed } from 'vue'
export default {
  props: {
    label: {
      type: String,
      default: '全选',
    },
    themeColor: {
      type: Object,
      default: () => ({}),
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { themeColor } = props
    const tap = e => {
      console.log('----')
      console.log(props.checked)
      emit('check')
    }

    const borderColor = computed(() => `border: 2px solid ${props.themeColor.curBg} `)
    const bgColor = computed(() => `background-color: ${props.themeColor.curBgSecond} `)

    return {
      tap,
      bgColor,
      borderColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.inner {
  width: 22px;
  height: 22px;
}
.radioRipple {
  position: absolute;
  transition: all 0.15s ease;
  width: 11px;
  height: 11px;
  z-index: 500;
  transform: translate(-50%, -50%) scale(0);
  top: 50%;
  left: 50%;
  border-radius: 50%;
}
.radioRipple.checked {
  transform: translate(-50%, -50%) scale(1) !important;
}
</style>
