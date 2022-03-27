<template>
  <view class="position-fixed refresh-area">
    <view class="refresh" v-if="type != 'withoutRefresh'">
      <watch-button @tap="refresh" type="refresh" :themeColor="getThemeColor">
      </watch-button>
    </view>
    <view class="totop">
      <watch-button @tap="toTop" type="totop" :themeColor="getThemeColor">
      </watch-button>
    </view>
  </view>
</template>

<script>
import WatchButton from "@/components/common/WatchButton";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  components: {
    WatchButton,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const getThemeColor = computed(() => store.state.theme);
    const refresh = () => {
      toTop();
      emit("refresh");
    };
    const toTop = () => {
      uni.pageScrollTo({
        scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0
        duration: 300, // 滚动动画的时长
      });
    };
    return { getThemeColor, toTop, refresh };
  },
};
</script>

<style lang="scss" scoped>
.refresh-area {
  width: 100rpx;
  height: 250rpx;
  bottom: 80rpx;
  right: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .refresh {
    width: 100rpx;
    height: 100rpx;
  }

  .totop {
    width: 100rpx;
    height: 100rpx;
  }
}
</style>