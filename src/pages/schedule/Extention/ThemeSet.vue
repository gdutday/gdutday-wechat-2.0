<template>
  <view class="position-relative">
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
              <view><text class="iconfont icon-icon-test4 pr-1"></text> 当前主题</view>
              <view :style="{ color: getThemeColor.curBgSecond }">{{ themeName }}</view>
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
                    backgroundImage: `linear-gradient(90deg, ${value.bgColor} ,${'#ccc'})`,
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
            <ming-list-item
              content="是否要上传背景图片"
              correctContent="上传"
              @cancelMethod="removeBackgroundImage"
              @correctMethod="openModal"
              :themeColor="getThemeColor"
            >
            </ming-list-item>
            <!-- <ming-list-item
              content="是否要反转背景部分字体颜色"
              :themeColor="getThemeColor"
            >
            </ming-list-item> -->
            <ming-list-item content="透明度设置" :themeColor="getThemeColor">
              <slider
                class="p-0 m-0"
                :style="{ width: '120px' }"
                min="0"
                max="100"
                :value="getOpacity"
                step="1"
                :activeColor="getThemeColor.curBgSecond"
                :block-color="getThemeColor.curBgSecond"
                @change="sliderChange"
                show-value
              />
            </ming-list-item>
          </view>
        </template>
      </ming-container>
    </view>
    <ming-confirm
      :showedScheduleInfo="showedScheduleInfo"
      :themeColor="getThemeColor"
      title="背景图片上传提醒"
      content="如果原本有背景图片，那么就会被覆盖。如果没有图片，建议将上传的图片先切割好（尽量以16：9的比例），以后更新时会增加背景切割功能。"
      @fatherMethod="choosePgPic"
    ></ming-confirm>
    <ming-toast
      :isShow="toastIsShow"
      @resumeToastIsShow="resumeToastIsShow"
      :content="warningInfo"
      :toastType="toastType"
      :themeColor="getThemeColor"
    ></ming-toast>
  </view>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Ztl from '@/components/common/Ztl.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import MingContainer from '@/components/common/MingContainer'
import MingListItem from '@/components/common/MingListItem'
import MingConfirm from '@/components/common/MingConfirm'
import MingToast from '@/components/common/MingToast'
import { color } from '@/static/color/color.js'
import { setThemeColor, getStorageSync, becomePromise } from '@/utils/common.js'
import { useToast, useMingModal } from '@/hooks/index.js'
export default {
  components: {
    Ztl,
    MingContainer,
    MingListItem,
    WatchButton,
    MingToast,
    MingConfirm,
  },
  setup() {
    const store = useStore()
    const warningInfo = ref('')
    let isChange = ref(false)
    let themeName = ref('')

    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } = useToast()

    const { openModal, close } = useMingModal()

    const getOpacity = computed(() => store.state.theme.opacity * 100)

    const getThemeColor = computed(() => store.state.theme)

    const sliderChange = e => {
      store.commit('theme/setOpacity', {
        opacity: e.detail.value / 100,
      })

      console.log('当前透明度为:', store.state.theme.opacity)
      uni.setStorageSync('opacity', store.state.theme.opacity)
      inspireToastIsShow()
      warningInfo.value = '调整透明度成功'
      toastType.value = 'success'
    }

    const setTheme = (item, ...args) => {
      isChange.value = true
      setTimeout(() => {
        isChange.value = false
      }, 300)
      themeName.value = item
      uni.setStorageSync('currentThemeName', item)
      setThemeColor(item, ...args)
    }

    const choosePgPic = async e => {
      //this.$isShake ? uni.vibrateShort() : '';
      try {
        const {
          tempFilePaths: [path],
        } = await becomePromise(uni.chooseImage, { count: 1 }, 'chooseImage')
        const { savedFilePath: newPath } = await becomePromise(uni.saveFile, { tempFilePath: path }, 'saveFile')
        const backgroundImage = getStorageSync('backgroundImage', '')
        if (backgroundImage != '') uni.removeStorageSync(backgroundImage)
        await becomePromise(uni.setStorage, { key: 'backgroundImage', data: newPath }, 'setStorage')
        store.commit('common/setBackgroundImage', {
          backgroundImagePath: newPath,
        })
        inspireToastIsShow()
        warningInfo.value = '背景图片上传成功'
        toastType.value = 'success'
        close()
      } catch (e) {
        inspireToastIsShow()
        toastType.value = 'warning'
        if (e[1] == 'chooseImage') warningInfo.value = '系统不支持选择图片'
        else if (e[1] == 'saveFile') warningInfo.value = '保存图片失败'
        else if (e[1] == 'setStorage') warningInfo.value = '保存图片路径失败'
      }
    }

    const removeBackgroundImage = () => {
      if (getStorageSync('backgroundImage') == '') {
        inspireToastIsShow()
        warningInfo.value = '目前没有背景图片'
        toastType.value = 'warning'
        return
      }

      store.commit('common/setBackgroundImage', {
        backgroundImagePath: '',
      })
      uni.setStorageSync('backgroundImage', '')
      inspireToastIsShow()
      warningInfo.value = '背景图片删除成功'
      toastType.value = 'success'
    }

    return {
      setTheme,
      color,
      getThemeColor,
      isChange,
      themeName,
      choosePgPic,
      removeBackgroundImage,
      resumeToastIsShow,
      toastIsShow,
      toastType,
      warningInfo,
      sliderChange,
      getOpacity,
      openModal,
    }
  },
}
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

  .ts-image-btn-area {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .ts-image-btn {
      width: 60px;
      height: 70%;
    }
  }
}
</style>
