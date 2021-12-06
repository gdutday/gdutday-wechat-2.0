<template>
  <view class=" w-1 wave" :style="{ backgroundColor: getThemeColor }">
    <!-- 这里的颜色其实是地下波浪的，因为旋转的是里面的wave -->
    <view class="content">
      <view  class="pic">
        <slot name="pic"><image src="@/static/newLogo.png" alt="" ></slot>
      </view>
      <view class="name"><slot name="name" >KRIS 猪猪</slot></view>
    </view>
  </view>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });

    return {
      getThemeColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.wave {
  height: 101%;
  position: relative;
  align-items: center;
  min-height: 100%;
  overflow: hidden;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 170%;
    min-height: 250%;
    background: linear-gradient(#90cad5, #fce1c2);
    animation: rotate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  &:before {
    bottom: 17%;
    border-radius: 45%;
    animation-duration: 7s;
  }

  &:after {
    bottom: 12%;
    opacity: 0.5;
    border-radius: 47%;
    animation-duration: 7s;

    // background: linear-gradient(#fab9b9, #fff);
  }

  .content {
    width: 100%;
    height: 270rpx;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99;

    .pic {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background-color: #fff;
      border: 1px solid #fff;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      display: inline;
      margin-top: 20rpx;
      height: 70rpx;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
}
</style>