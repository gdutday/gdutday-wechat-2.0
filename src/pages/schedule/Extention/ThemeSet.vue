<template>
  <view class="ts">
    <Ztl>
      <template v-slot:navName>
        <view>主题设置</view>
      </template>
    </Ztl>
    <view class="ts-container w-1">
      <view
        class="ts-desc w-1 coloum-container"
        :style="{ borderLeft: `${getThemeColor.curBg} 6px solid` }"
      >
        <view>当前主题</view>
        <view>{{ "桃红" }}</view>
      </view>
      <view
        class="ts-theme w-1 coloum-container"
        :style="{ borderLeft: `${getThemeColor.curBg} 6px solid` }"
      >
        <view
          v-for="(value, key) in color"
          :key="key"
          @click="setTheme(key, value)"
          class="ts-theme-item pr-2"
        >
          <view
            class="ts-theme-item-show"
            :style="{
              backgroundImage: `linear-gradient(90deg, ${
                value.bgColor
              } ,${'#ccc'})`,
              marginTop: '20rpx',
            }"
          >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import { color } from "@/static/color/color.js";
import { setThemeColor } from "@/utils/common.js";
export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore();

    const setTheme = (item, ...args) => {
      uni.setStorageSync("currentThemeName", item);
      setThemeColor(item, ...args);
    };

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    return {
      setTheme,
      color,
      getThemeColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.ts-container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .ts-desc {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .ts-theme {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;

    .ts-theme-item {
      .ts-theme-item-show {
        width: 85rpx;
        height: 85rpx;
        border-radius: 50%;
      }
    }
  }
}
</style>