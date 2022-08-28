<template>
  <movable-area
    :style="{
      height: getWdHeight - getExeHeight + 'px',
      backgroundImage: backgroundString,
    }"
    class="w-1 movable-area bg-img"
  >
    <movable-view
      :y="y"
      animation
      damping="20"
      direction="all"
      class="w-1 movable-view"
      @touchstart="touchstart"
      @touchend="touchend"
      :style="{ height: getWdHeight + 'px' }"
    >
      <!-- 这一块用来写下拉菜单的拓展区 -->
      <view
        class="w-1"
        :style="{
          height: getExeHeight + 'px',
        }"
      >
        <view class="w-1">
          <schedule-extention :exeHeight="getExeHeight"></schedule-extention>
        </view>
      </view>
      <view
        class="w-1 schedule-content"
        :style="{
          height: getWdHeight - getExeHeight + 'px',
        }"
      >
        <select-day class="w-1" :themeColor="getThemeColor"></select-day>
        <view class="w-1 schedule-content-container" :style="{ height: getWdHeight - getExeHeight - 32 + 'px' }">
          <view
            class="schedule-content-left left-width h-1"
            :style="{
              backgroundColor: hexToRgba(getThemeColor.curBg, getThemeColor.opacity),
              color: getThemeColor.curTextC,
            }"
          >
            <text v-for="(item, index) of long" :key="index" class="flex-center">{{ item + 1 }}</text>
          </view>
          <view class="schedule-swiper h-1 w-1">
            <schedule-swiper class="h-1 w-1" :themeColor="getThemeColor"></schedule-swiper>
          </view>
        </view>
      </view>
    </movable-view>
  </movable-area>
</template>

<script>
import { onMounted, ref, reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import ScheduleExtention from '@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/ScheduleExtention.vue'
import SelectDay from '@/components/content/schedule/ScheduleContent/MingRefresh/SelectDay.vue'
import ScheduleSwiper from '@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleSwiper.vue'
import { changeRpxToPx, hexToRgba } from '@/utils/common.js'
export default {
  components: {
    ScheduleExtention,
    SelectDay,
    ScheduleSwiper,
  },
  setup() {
    const store = useStore()
    const long = 12
    let pageSetting = reactive({
      y: 0,
      start: 0,
      end: 0,
    })
    let scrollStatus = ref(0)
    //如果Status是0说明在下滑，如Status是1说明是上滑

    let getWdHeight = computed(() => {
      return store.state.navInfo.wdHeight
    })

    let getExeHeight = computed(() => {
      let px = changeRpxToPx(80)
      // console.log(px);
      // console.log(store.state.navInfo.allHeight + px);
      return store.state.navInfo.allHeight + px
    })

    const getThemeColor = computed(() => {
      return store.state.theme
    })

    const backgroundString = ref('')

    const touchstart = event => {
      console.log('开启时的对上方距离' + event.changedTouches[0].clientY)
      pageSetting.start = event.changedTouches[0].clientY
    }

    const touchend = event => {
      console.log(event)
      console.log('结束时的对上方距离' + event.changedTouches[0].clientY)
      pageSetting.end = event.changedTouches[0].clientY
    }

    const getBackgroundImage = computed(() => store.state.common.backgroundImage)

    const handleBackgroundString = () => {
      if (getBackgroundImage.value == '') return (backgroundString.value = '')

      uni.getSystemInfo({
        success: res => {
          if (res.platform == 'ios') {
            uni.getFileSystemManager().readFile({
              filePath: getBackgroundImage.value,
              encoding: 'base64',
              success: res => (backgroundString.value = 'url(data:image;base64,' + res.data + ')'),
            })
          } else {
            backgroundString.value = 'url(' + getBackgroundImage.value + ')'
          }
        },
      })
    }

    watch(
      () => pageSetting.end,
      () => {
        let diff = pageSetting.end - pageSetting.start
        console.log(pageSetting.end - pageSetting.start)
        diff < 0 ? (scrollStatus.value = 0) : (scrollStatus.value = 1)

        if (diff < 0) {
          if (diff > -30) {
            pageSetting.y = pageSetting.y + 0.1
          } else {
            pageSetting.y = -300
          }
        } else {
          if (diff < 30) {
            //说明在上滑
            pageSetting.y = pageSetting.y - 0.1
          } else {
            pageSetting.y = 0
          }
        }
      }
    )

    watch(
      () => getBackgroundImage.value,
      () => {
        handleBackgroundString()
      },
      {
        immediate: true,
      }
    )

    onMounted(() => {
      pageSetting.y = -300
    })

    return {
      long,
      ...toRefs(pageSetting),
      getWdHeight,
      getExeHeight,
      getThemeColor,
      touchend,
      touchstart,
      getBackgroundImage,
      hexToRgba,
      backgroundString,
    }
  },
}
</script>

<style lang="scss" scoped>
.movable-view {
  position: relative;
  .schedule-content {
    .schedule-content-container {
      display: flex;
      flex-direction: row;

      .schedule-content-left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-radius: 35rpx;
        padding-right: 3rpx;
        .schedule-content-time {
          flex: 1;
        }
      }

      .schedule-swiper {
        flex: 1;
      }
    }
  }
}
</style>
