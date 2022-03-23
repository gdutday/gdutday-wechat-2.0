<template>
  <view class="w-1">
    <view class="wave">
      <Wave>
        <template v-slot:pic
          ><view class="flex-center">
            <text
              class="wave-back iconfont icon-icon-test36"
              @tap="goBack"
            ></text></view
        ></template>
        <template v-slot:name
          ><view class="flex-center"
            ><text class="wave-title">{{ title }}</text></view
          ></template
        >
      </Wave>
    </view>
    <slot name="default"></slot>
  </view>
</template>

<script>
import Wave from "@/components/common/Wave";
export default {
  components: {
    Wave,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup(props) {
    console.log(props);
    const goBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };

    return {
      goBack,
    };
  },
};
</script>

<style lang="scss" scoped>
.wave {
  height: 500rpx;

  .wave-back {
    font-size: 50px;
  }

  .wave-title {
    font-size: 30px;
    z-index: 999;
  }
}
</style>