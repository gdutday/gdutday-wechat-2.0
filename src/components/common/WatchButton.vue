<template>
  <view class="w-1 h-1 position-relative">
    <view
      class="simple-button transition-1 flex-center time position-absolute"
      :class="[
        show ? 'simple-button--tap depth-3 ' : '',
        'h-1',
        'w-1',
        type == 'refresh' && show ? 'spanRotate' : '',
      ]"
      @touchstart="handleTap"
      @tap="tap"
      :style="{
        backgroundColor: themeColor.curBg,
        color: themeColor.curTextC,
      }"
    >
      <text v-if="type == 'default'">{{ value }}</text>
      <text
        v-else-if="type == 'totop'"
        class="iconfont icon-icon-test41"
      ></text>
      <text
        v-else-if="type == 'refresh'"
        class="iconfont icon-icon-test22"
      ></text>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    type: {
      type: String,
      default: "default",
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
      tap,
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

.iconfont {
  font-size: 1.5rem;
}
</style>