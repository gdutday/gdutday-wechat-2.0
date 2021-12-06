<template>
  <view class="item depth-4 my-3">
    <view class="item-header">
      <text
        class="item-header-title coloum-container title-font"
        :style="{ borderLeft: `${getThemeColor.curBg} 6px solid` }"
        ><slot name="title">标题</slot></text
      >
      <text class="item-header-desc text-dark py-1"
        ><slot name="desc">这里是描述</slot></text
      >
      <text class="item-header-extra text-dark py-1"
        ><slot name="extra"></slot
      ></text>
    </view>
    <view class="item-content flex-center w-1">
      <slot>
        <view>表格</view>
      </slot>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    return {
      getThemeColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 20px;
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  border-radius: 15px;

  .item-header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .item-header-title,
    .item-header-extra {
      font-size: 24px;
    }
  }

  .item-content {
    flex: 1;
    flex-direction: column;
  }
}
</style>