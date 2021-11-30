<template>
  <view class="w-1" :style="{ backgroundColor: getThemeColor }">
    <view :style="{ height: navInfo.zltHeight + 'px' }" class="w-1"></view>
    <view class="ztl-nav w-1" :style="{ height: navInfo.navHeight + 'px' }">
      <view
        class="ztl-content w-1 flex-center"
        :style="{
          height: navInfo.jnHeight + 'px',
        }"
      >
        <view class="left flex-center" @tap="goBack"
          ><slot name="navBack">'上一页'</slot></view
        >
        <view><slot name="navName">Nav</slot></view>
        <view class="right flex-center"></view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    let navInfo = computed(() => {
      return store.state.navInfo;
    });

    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });

    const goBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };

    return {
      navInfo,
      goBack,
      getThemeColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.ztl-nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  .ztl-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 32rpx;

    .left,
    .right {
      width: 60px;
    }
  }
}
</style>