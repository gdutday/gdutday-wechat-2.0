<template>
  <view
    :style="{
      height: navInfo.zltHeight + navInfo.navHeight + 'px',
      backgroundColor: getThemeColor.curBgSecond,
      color: getThemeColor.curTextC,
    }"
    class="position-relative"
  >
    <view
      class="w-1"
      :class="changeTheme ? 'animation-fade' : ''"
      :style="{
        position: 'fixed',
        fontSize: '18px',
        backgroundColor: getThemeColor.curBgSecond,
        zIndex: 100,
      }"
    >
      <view
        :style="{
          height: navInfo.zltHeight + 'px',
        }"
        class="w-1"
      ></view>
      <view
        class="ztl-nav w-1 rounded-nav"
        :style="{
          height: navInfo.navHeight + 'px',
          backgroundColor: getThemeColor.curBg,
        }"
      >
        <view
          class="ztl-content w-1 flex-center"
          :style="{
            height: navInfo.jnHeight + 'px',
          }"
        >
          <view class="left flex-center" @tap="goBack"
            ><slot name="navBack"
              ><text class="iconfont icon-icon-test36"></text></slot
          ></view>
          <view><slot name="navName">Nav</slot></view>
          <view class="right flex-center"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    let changeTheme = ref(false);
    const store = useStore();
    let navInfo = computed(() => {
      return store.state.navInfo;
    });

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    watch(
      () => getThemeColor.value.curBg,
      () => {
        changeTheme.value = true;
        setTimeout(() => {
          changeTheme.value = false;
        }, 600);
      }
    );

    const goBack = () => {
      uni.navigateBack({
        delta: 1,
      });
    };

    return {
      navInfo,
      goBack,
      getThemeColor,
      changeTheme,
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

    .left,
    .right {
      width: 60px;
    }
  }
}
</style>