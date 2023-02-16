<template>
  <view class="content">
    <schedule-top
      class="scheduletop"
      :navInfo="navInfo"
      @open="inspireToastIsShow"
      :style="{
        height: navInfo.allHeight + 'px',
        backgroundColor: getThemeColor.curBgSecond,
        color: getThemeColor.curTextC,
      }"
    ></schedule-top>

    <!-- 这里是课表main部分 -->
    <schedule-content class="schedule-content" :key="keyValue"></schedule-content>
    <!-- 展示课表详情 -->
    <week-content-detail :showedScheduleInfo="showedScheduleInfo" :bgColor="getThemeColor.curBg"></week-content-detail>
    <open-page :toastIsShow="toastIsShow" @close="resumeToastIsShow"></open-page>
  </view>
</template>

<script>
import { ref, toRefs, computed, onMounted, watch, provide } from 'vue'
import { createLogger, useStore } from 'vuex'
import ScheduleTop from '@/components/content/schedule/ScheduleTop.vue'
import ScheduleContent from '@/components/content/schedule/ScheduleContent/ScheduleContent.vue'

import MingModal from '@/components/common/MingModal.vue'
import WeekContentDetail from '@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContentDetail.vue'
import OpenPage from '@/components/common/OpenPage/OpenPage.vue'
import { setDefaultTheme, getCurrentWeek } from '@/utils/common.js'
import { getTermDate } from '@/utils/getTermDate.js'
import { color } from '@/static/color/color.js'
import { openningDate } from '@/static/time.js'
import { getStorageSync, setThemeColor, uuidV4,filterSchedule,handleSchedule } from '@/utils/common.js'
import { useToast, useShare } from '@/hooks/index.js'
import { handleGradeId } from '@/utils/tempHandleGrade.js'
import useSelectorOptions from '@/components/content/schedule/ScheduleContent/ScheduleSelector/SelectorController/classoptions-hook'

import {
	saveRefreshTime,
	isRefreshTime,
	graduateReLogin,
	scheduleGraduateInfoFresh
} from '@/network/ssxRequest/ssxInfo/graduateAllInfo.js'

export default {
  components: {
    ScheduleTop,
    ScheduleContent,
    MingModal,
    WeekContentDetail,
    OpenPage,
  },
  setup() {
    const store = useStore();
    let allWeeks = ref([])
    let currentWeek = ref(0)

    const { admitPageShare } = useShare()
    admitPageShare() //允许分享

    const { insertScheduleWhileRefresh } = useSelectorOptions()
    if (getStorageSync('exam')) {
      handleGradeId()
    }
    let isGradute = getStorageSync('loginIsGraduteStudent');
    if (isGradute) {
    	// 检查课表是否需要刷新
    	if(isRefreshTime()){
			console.log("需要刷新课表！")
    		graduateReLogin();
			scheduleGraduateInfoFresh().then((obj)=>{
				    console.log(obj);
					console.log("返回数据获取成");
					let weeksData = obj.weeksData;
					let scheduleIdColor = obj.scheduleIdColor;

					uni.setStorageSync('weeksData', weeksData);
					uni.setStorageSync('scheduleIdColor', scheduleIdColor);
					console.log(store);
					handleSchedule(weeksData, getStorageSync('currentWeek'), store.state.scheduleInfo
						.currentSwiperIndex)
					insertScheduleWhileRefresh()
					// 记录刷新时间
					saveRefreshTime();
					uni.showToast({
						title: '自动刷新成功！',
						duration: 2000,
					})
				})
				.catch(err => {
					console.log(err)
					uni.showToast({
						title: '自动刷新失败！',
						duration: 4000,
					})
				})
		}
			
    }
    const init = () => {
      let system = uni.getSystemInfoSync()
      uni.setStorageSync('platform', system.platform)

      uni.setStorageSync('schoolOpening', openningDate())
      allWeeks.value = getTermDate(getStorageSync('schoolOpening'))
      currentWeek.value = getCurrentWeek()

      let menu = uni.getMenuButtonBoundingClientRect()
      store.commit('navInfo/setnavInfo', {
        zltHeight: system.statusBarHeight, //状态栏高度
        navHeight: (menu.top - system.statusBarHeight) * 2 + menu.height, //导航栏高度
        jnHeight: menu.height, //胶囊高度
        wdHeight: system.windowHeight,
        wdWdith: system.windowWidth,
      })
      store.commit('scheduleInfo/setCurrentWeek', {
        currentWeek: currentWeek.value,
      })
      store.commit('scheduleInfo/setAllWeeks', { allWeeks: allWeeks.value })
      store.commit('scheduleInfo/setPickWeek', { pickWeek: currentWeek.value })
      if (getStorageSync('futureExam')) {
        store.commit('exam/setFutureExam', {
          futureExam: getStorageSync('futureExam'),
        })
      }

      setThemeColor('forest', color.forest)
      insertScheduleWhileRefresh()
    }

    let navInfo = computed(() => store.state.navInfo)

    //从vuex里获取我获得的课表的内容
    let showedScheduleInfo = computed(() => store.state.scheduleInfo.showedScheduleInfo)

    // 获取主题颜色
    const getThemeColor = computed(() => store.state.theme)

    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } = useToast()
    //inspireToastIsShow()

    onMounted(() => {
      init()
    })

    return {
      navInfo,
      showedScheduleInfo,
      getThemeColor,
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  .scheduletop {
    width: 100%;
    z-index: 99;
  }

  .schedule-content {
    width: 100%;
    height: 100%;
  }
}
</style>
