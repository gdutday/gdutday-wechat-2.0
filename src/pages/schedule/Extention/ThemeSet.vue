<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <view>主题设置</view>
      </template>
    </Ztl>
    <view class="px-3 w-1">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>切换主题</text> </template>
        <template v-slot:desc>
          <text>在这里可以切换主题</text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            <view
              class="ts-desc w-1 px-2 my-2"
              :style="{ borderBottom: `${getThemeColor.curBg} 2px solid` }"
              :class="isChange ? 'animation-fade' : ''"
            >
              <view
                ><text class="iconfont icon-icon-test4 pr-1"></text>
                当前主题</view
              >
              <view>{{ themeName }}</view>
            </view>
            <view class="ts-theme w-1">
              <view
                v-for="(value, key) in color"
                :key="key"
                @click="setTheme(key, value)"
                class="ts-theme-item flex-center"
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
                  <text
                    class="t iconfont icon-icon-test45"
                    :class="isChange ? 'animation-fade' : ''"
                    v-if="value.bgColor == getThemeColor.curBg"
                  ></text>
                </view>
              </view>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import { color } from "@/static/color/color.js";
import { setThemeColor, getStorageSync } from "@/utils/common.js";
export default {
  components: {
    Ztl,
    MingContainer,
  },
  setup() {
    const store = useStore();
    let isChange = ref(false);
    let themeName = ref("");
    const setTheme = (item, ...args) => {
      isChange.value = true;
      setTimeout(() => {
        isChange.value = false;
      }, 300);
      themeName.value = item;
      console.log(item);
      uni.setStorageSync("currentThemeName", item);
      setThemeColor(item, ...args);
    };

    onMounted(() => {
      themeName.value = getStorageSync("currentThemeName");
    });

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    return {
      setTheme,
      color,
      getThemeColor,
      isChange,
      themeName,
    };
  },
};
</script>

<style lang="scss" scoped>
.ts-desc {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.ts-theme {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  .ts-theme-item {
    width: 20%;
    .ts-theme-item-show {
      position: relative;
      width: 85rpx;
      height: 85rpx;
      border-radius: 50%;
      .t {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .iconfont {
        font-size: 80rpx;
      }
    }
  }
}
</style>