<template>
  <view class="w-1 h-1 position-relative">
    <view
      class="simple-button transition-1 flex-center time position-absolute"
      :class="[show ? 'simple-button--tap depth-3 ' : '', 'h-1', 'w-1']"
      @touchstart="handleTap"
      @tap="tap"
      :style="{
        backgroundColor: themeColor.curBg,
        color: themeColor.curTextC,
      }"
    >
      {{ value }}
    </view>
  </view>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    value: {
      type: String,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    let show = ref(false);
    console.log(props.themeColor);
    const handleTap = () => {
      console.log(111);
      show.value = true;
      setTimeout(() => {
        console.log(222);
        show.value = false;
      }, 500);
    };

    const tap = () => {};

    return {
      handleTap,
      show,
      tap
    };
  },
};
</script>

<style lang="scss" scoped>
.simple-button {
  border-radius: 40px;
  top: 0;
}

.simple-button--tap {
  border: 2px solid #17a2b8 !important;
  top: -5px;
}
</style>