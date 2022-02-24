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
            <view class="ts-theme w-1 my-2">
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
            <view
              class="ts-image w-1 px-2 mt-2"
              :style="{ borderBottom: `${getThemeColor.curBg} 2px solid` }"
            >
              <view>是否要上传背景图片</view>
              <view class="ts-image-btn">
                <watch-button
                  @tap="choosePic"
                  value="上传"
                  :themeColor="getThemeColor"
                ></watch-button>
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
import WatchButton from "@/components/common/WatchButton.vue";
import MingContainer from "@/components/common/MingContainer";
import { color } from "@/static/color/color.js";
import { setThemeColor, getStorageSync } from "@/utils/common.js";
export default {
  components: {
    Ztl,
    MingContainer,
    WatchButton,
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

    const choosePic = () => {
      uni.chooseImage({
        success: (chooseImageRes) => {
          // 获取的格式是数组，多选会同时返回，单选只返回一项
          console.log(chooseImageRes);
          const tempFilePaths = chooseImageRes.tempFilePaths;
          // 若多选，需循环调用uni.uploadFile ，因微信小程序只支持单文件上传
          uni.uploadFile({
            url: "", //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              user: "test", // 上传附带参数
            },
            success: (uploadFileRes) => {
              // 根据接口具体返回格式   赋值具体对应url
              console.log(uploadFileRes);
              console.log(uploadFileRes.data);
            },
            fail: (err) => {
              console.log(err);
            },
          });
        },
      });
    };

    return {
      setTheme,
      color,
      getThemeColor,
      isChange,
      themeName,
      choosePic,
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
  height: 60px;
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
.ts-image {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  .ts-image-btn {
    width: 60px;
    height: 70%;
  }
}
</style>