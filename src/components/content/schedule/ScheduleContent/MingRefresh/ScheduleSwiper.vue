<template>
  <view class="w-1 h-1">
    <swiper
      class="w-1 h-1 swiper"
      @change="change($event)"
      :indicator-dots="false"
      :duration="500"
      circular
      v-if="isLoginStatus"
    >
      <swiper-item class="w-1 h-1" v-for="(item, index) of 3" :key="index">
        <week-content :weekContent="getpickWeekSchedule[index]" :themeColor="themeColor"></week-content>
      </swiper-item>
    </swiper>
    <view v-else class="h-1 w-1 flex-center">
      <view :style="{ height: '60px', width: '120px' }">
        <watch-button @tap="navigateToLogin" value="我要登陆" :themeColor="themeColor"> </watch-button>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import WatchButton from '@/components/common/WatchButton.vue'
import WeekContent from '@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContent.vue'
import { getStorageSync } from '@/utils/common.js'

export default {
  components: {
    WeekContent,
    WatchButton,
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
      uni.switchTab({
        url: '/pages/profile/Profile',
      })
    }

    const isLoginStatus = computed(() => store.state.common.isLogin)

    return {
      getCurrentWeek,
      change,
      swiperList,
      getpickWeekSchedule,
      isLoginStatus,
      navigateToLogin,
    }
  },
}
</script>

<style lang="scss" scoped></style>
