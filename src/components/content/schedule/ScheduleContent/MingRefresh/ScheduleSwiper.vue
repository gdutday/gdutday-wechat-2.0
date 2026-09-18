<template>
  <view class="w-1 h-1">
    <view v-if="isLoginStatus || isDemoSchedule" class="w-1 h-1 position-relative">
      <swiper class="w-1 h-1 swiper" @change="change($event)" :indicator-dots="false" :duration="500" circular>
        <swiper-item class="w-1 h-1" v-for="(item, index) of 3" :key="index">
          <week-content :weekContent="getpickWeekSchedule[index]" :themeColor="themeColor"></week-content>
        </swiper-item>
      </swiper>
      <view v-if="isDemoSchedule" class="demo-fab-wrap">
        <view v-if="demoFabOpen" class="demo-fab-menu">
          <view class="demo-fab-item" @tap="changeDemoSchedule">
            <text class="demo-fab-item-icon">✨</text>
            <text class="demo-fab-item-label">换一批</text>
          </view>
          <view class="demo-fab-divider"></view>
          <view class="demo-fab-item" @tap="exitDemoSchedule">
            <text class="demo-fab-item-icon">←</text>
            <text class="demo-fab-item-label">退出演示</text>
          </view>
        </view>
        <view
          class="demo-fab-button"
          :class="{ 'demo-fab-button--open': demoFabOpen }"
          :style="{
            backgroundColor: themeColor.curBgSecond,
            transform: demoFabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }"
          @tap="toggleDemoFab"
        >
          <text class="demo-fab-icon">✦</text>
        </view>
      </view>
    </view>
    <view v-else class="empty-state">
      <view class="empty-state-inner">
        <text class="empty-state-hint">还没有登录，先看看示例</text>
        <view class="empty-state-actions">
          <view
            class="empty-btn empty-btn--demo"
            :style="{ backgroundColor: themeColor.curBgSecond }"
            @tap="showDemoSchedule"
          >
            <text class="empty-btn-demo-icon">✦</text>
            <text class="empty-btn-demo-label">看看 demo</text>
          </view>
          <view class="empty-btn empty-btn--login" @tap="navigateToLogin">
            <text class="empty-btn-login-label">登录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {computed, onMounted, ref, watch} from 'vue'
import {useStore} from 'vuex'
import WeekContent from '@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContent.vue'
import {getStorageSync, handleSchedule} from '@/utils/common.js'
import {buildDemoSchedule} from '@/utils/demoSchedule.js'

export default {
  components: {
    WeekContent,
  },
  props: {
    themeColor: {
      type: Object,
    },
  },
  setup() {
    const store = useStore()
    let getPickWeek = computed(() => {
      return store.state.scheduleInfo.pickWeek
    })
    let getCurrentWeek = computed(() => {
      return store.state.scheduleInfo.currentWeek
    })
    let getpickWeekSchedule = computed(() => {
      return store.state.scheduleInfo.pickWeekSchedule
    })
    // 引入所有课程表
    let weeksData = computed(() => {
      return store.state.scheduleInfo.schedule
    })
    console.log('--------------------')
    console.log(store.state.scheduleInfo)
    console.log('--------------------')
    // 传到三个组件的课程表
    let swiperList = ref([])
    swiperList.value = [
      weeksData.value[getPickWeek.value],
      weeksData.value[(getPickWeek.value + 1) % 20],
      weeksData.value[(20 + ((getPickWeek.value - 1) % 20)) % 20],
    ]
    console.log(swiperList.value)
    //在此处完成初始化
    store.commit('scheduleInfo/setPickWeekSchedule', {
      pickWeekSchedule: swiperList.value,
    })

    const change = event => {
      //console.log(event);
      //从vuex里获得的当前选择的周数
      console.log(event)
      if (store.state.scheduleInfo.pickWeekSchedule.length != 0) {
        swiperList.value = store.state.scheduleInfo.pickWeekSchedule
      }
      //****************************************** */
      //下面是swiper的index
      const swiperListLen = swiperList.value.length
      let currentSwiperIndex = event.detail.current
      let nextSwiperIndex = (currentSwiperIndex + 1) % swiperListLen
      let beforeSwiperIndex = (currentSwiperIndex + 2) % swiperListLen

      //将当前页面的index上传到vuex,以便于进行点击切换的页面不乱
      store.commit('scheduleInfo/setCurrentSwiperIndex', {
        currentSwiperIndex: currentSwiperIndex,
      })

      console.log(swiperList.value[currentSwiperIndex].slice(-1)[0])
      console.log(swiperList.value)
      console.log(2222)
      //设置当前的周次的
      store.commit('scheduleInfo/setPickWeek', {
        pickWeek: swiperList.value[currentSwiperIndex].slice(-1)[0],
      })

      //下面是周数的选择
      let pickWeek = getPickWeek.value
      let nextWeek = (getPickWeek.value + 1) % 20
      let beforeWeek = (20 + ((getPickWeek.value - 1) % 20)) % 20
      //****************************************** */

      swiperList.value[currentSwiperIndex] = weeksData.value[pickWeek]
      swiperList.value[nextSwiperIndex] = weeksData.value[nextWeek]
      swiperList.value[beforeSwiperIndex] = weeksData.value[beforeWeek]

      //在这里将更新好的课表上传
      store.commit('scheduleInfo/setPickWeekSchedule', {
        pickWeekSchedule: swiperList.value,
      })

      console.log('-----------------------------')
      console.log('-----------------------------')
      console.log('getPickWeek.value当前选择的周的index' + getPickWeek.value)
      console.log(swiperList.value)
      //console.log("当前页面是第" + swiperList.value[currentIndex][7] + "周");
      console.log('-----------------------------')
    }

    const navigateToLogin = () => {
      uni.navigateTo({
        url: "/pages/login-v2/index",
      })
    }

    const isLoginStatus = computed(() => store.state.common.isLogin)
    const isDemoSchedule = computed(() => store.state.scheduleInfo.isDemoSchedule)

    const showDemoSchedule = () => {
      const {weeksData, scheduleIdColor} = buildDemoSchedule()
      const currentWeek = Math.min(
        19,
        Math.max(0, Number(store.state.scheduleInfo.currentWeek) || 0)
      )

      store.commit('scheduleInfo/setDemoSchedule', {
        weeksData,
        scheduleIdColor,
      })
      handleSchedule(
        weeksData,
        currentWeek,
        store.state.scheduleInfo.currentSwiperIndex
      )
    }

    const changeDemoSchedule = () => showDemoSchedule()
    const exitDemoSchedule = () => store.commit('scheduleInfo/clearDemoSchedule')
    const demoFabOpen = ref(false)
    const toggleDemoFab = () => {
      demoFabOpen.value = !demoFabOpen.value
    }

    const clearDemoUserData = () => {
      store.commit('exam/clearDemoExamData')
      store.commit('scheduleInfo/clearDemoSchedule')
    }

    watch(isLoginStatus, status => {
      if (status) {
        clearDemoUserData()
      }
    })

    return {
      getCurrentWeek,
      change,
      swiperList,
      getpickWeekSchedule,
      isLoginStatus,
      navigateToLogin,
      isDemoSchedule,
    showDemoSchedule,
    changeDemoSchedule,
    exitDemoSchedule: clearDemoUserData,
      demoFabOpen,
      toggleDemoFab,
    }
  },
}
</script>

<style lang="scss" scoped>
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.empty-state-hint {
  font-size: 26rpx;
  opacity: 0.55;
  color: #666;
}

.empty-state-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.empty-btn {
  width: 220rpx;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-btn--demo {
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.empty-btn-demo-icon {
  font-size: 28rpx;
}

.empty-btn-demo-label {
  font-size: 28rpx;
  font-weight: 500;
}

.empty-btn--login {
  background-color: transparent;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
}

.empty-btn-login-label {
  font-size: 28rpx;
  color: #555;
}

.demo-fab-wrap {
  position: absolute;
  bottom: 24px;
  right: 16px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.demo-fab-menu {
  margin-bottom: 12px;
  border-radius: 24rpx;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.demo-fab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24rpx 32rpx;
}

.demo-fab-item-icon {
  font-size: 26rpx;
}

.demo-fab-item-label {
  font-size: 26rpx;
  color: #333;
}

.demo-fab-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.06);
  margin: 0 16rpx;
}

.demo-fab-menu {
  display: flex;
  flex-direction: column;
}

.demo-fab-button {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  transition: transform 0.25s ease;
}

.demo-fab-icon {
  color: #fff;
  font-size: 36rpx;
  line-height: 1;
}
</style>
