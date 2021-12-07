<template>
  <cover-view :style="{ height: navInfo.zltHeight + navInfo.navHeight + 'px' }">
    <cover-view
      class="w-1 depth-3"
      :class="changeTheme ? 'animation-fade' : ''"
      :style="{
        backgroundColor: getThemeColor,
        color: getThemeTextColor,
        position: 'fixed',
        fontSize: '16px',
        zIndex: 999,
      }"
    >
      <cover-view
        :style="{ height: navInfo.zltHeight + 'px' }"
        class="w-1"
      ></cover-view>
      <cover-view
        class="ztl-nav w-1"
        :style="{ height: navInfo.navHeight + 'px' }"
      >
        <cover-view
          class="ztl-content w-1 flex-center"
          :style="{
            height: navInfo.jnHeight + 'px',
          }"
        >
          <cover-view class="left flex-center" @tap="goBack"
            ><slot name="navBack">{{ "上一页" }}</slot></cover-view
          >
          <cover-view><slot name="navName">Nav</slot></cover-view>
          <cover-view class="right flex-center"></cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
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
      return store.state.theme.curBg;
    });

    const getThemeTextColor = computed(() => {
      return store.state.theme.curTextC;
    });

    watch(
      () => getThemeColor.value,
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
      getThemeTextColor,
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