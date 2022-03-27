<template>
  <view class="content">
    <schedule-top
      class="scheduletop"
      :navInfo="navInfo"
      :style="{
        height: navInfo.allHeight + 'px',
        backgroundColor: getThemeColor.curBgSecond,
        color: getThemeColor.curTextC,
      }"
    ></schedule-top>
    <!-- 这里是课表main部分 -->
    <schedule-content
      class="schedule-content"
      :key="keyValue"
    ></schedule-content>
    <!-- 展示课表详情 -->
    <week-content-detail
      :showedScheduleInfo="showedScheduleInfo"
      :bgColor="getThemeColor.curBg"
    ></week-content-detail>
    <open-page
      :toastIsShow="toastIsShow"
      @close="resumeToastIsShow"
    ></open-page>
  </view>
</template>

<script>
import { ref, toRefs, computed, onMounted, watch, provide } from "vue";
import { useStore } from "vuex";
import ScheduleTop from "@/components/content/schedule/ScheduleTop.vue";
import ScheduleContent from "@/components/content/schedule/ScheduleContent/ScheduleContent.vue";
import MingModal from "@/components/common/MingModal.vue";
import WeekContentDetail from "@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContentDetail.vue";
import OpenPage from "@/components/common/OpenPage/OpenPage.vue";
import { setDefaultTheme, getCurrentWeek } from "@/utils/common.js";
import { getTermDate } from "@/utils/getTermDate.js";
import { color } from "@/static/color/color.js";
import { openningDate } from "@/static/time.js";
import { getStorageSync, setThemeColor } from "@/utils/common.js";
import { useToast, useShare } from "@/hooks/index.js";

export default {
  setup() {
    const store = useStore();
    let allWeeks = ref([]);
    let currentWeek = ref(0);

    const { admitPageShare } = useShare();
    admitPageShare(); //允许分享

    const init = () => {
      let system = uni.getSystemInfoSync();
      uni.setStorageSync("platform", system.platform);
      uni.setStorageSync("schoolOpening", openningDate());

      allWeeks.value = getTermDate(getStorageSync("schoolOpening"));
      currentWeek.value = getCurrentWeek();

      let menu = uni.getMenuButtonBoundingClientRect();
      store.commit("navInfo/setnavInfo", {
        zltHeight: system.statusBarHeight, //状态栏高度
        navHeight: (menu.top - system.statusBarHeight) * 2 + menu.height, //导航栏高度
        jnHeight: menu.height, //胶囊高度
        wdHeight: system.windowHeight,
        wdWdith: system.windowWidth,
      });
      store.commit("scheduleInfo/setCurrentWeek", {
        currentWeek: currentWeek.value,
      });
      store.commit("scheduleInfo/setAllWeeks", { allWeeks: allWeeks.value });
      store.commit("scheduleInfo/setPickWeek", { pickWeek: currentWeek.value });
      if (getStorageSync("futureExam")) {
        store.commit("exam/setFutureExam", {
          futureExam: getStorageSync("futureExam"),
        });
      }

      setThemeColor("forest", color.forest);
    };

    let navInfo = computed(() => store.state.navInfo);

    //从vuex里获取我获得的课表的内容
    let showedScheduleInfo = computed(
      () => store.state.scheduleInfo.showedScheduleInfo
    );

    // 获取主题颜色
    const getThemeColor = computed(() => store.state.theme);

    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } =
      useToast();
    inspireToastIsShow();

    onMounted(() => {
      init();
    });

    return {
      navInfo,
      showedScheduleInfo,
      getThemeColor,
      toastType,
      toastIsShow,
      resumeToastIsShow,
      inspireToastIsShow,
    };
  },
  components: {
    ScheduleTop,
    ScheduleContent,
    MingModal,
    WeekContentDetail,
    OpenPage,
  },
};
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
