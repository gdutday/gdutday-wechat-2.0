<template :key="isRefresh">
  <view class="content">
    <schedule-top
      class="scheduletop"
      :navInfo="navInfo"
      :style="{
        height: navInfo.allHeight + 'px',
        backgroundColor: getThemeColor,
      }"
    ></schedule-top>
    <schedule-content
      class="schedule-content"
      :key="keyValue"
    ></schedule-content>
    <ming-modal @close="close" :isShow="isShow">
      <template v-slot:default>
        <week-content-detail
          :showedScheduleInfo="showedScheduleInfo"
          :bgColor="getThemeColor"
        ></week-content-detail>
      </template>
    </ming-modal>
  </view>
</template>

<script>
import { ref, toRefs, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import ScheduleTop from "@/components/content/schedule/ScheduleTop.vue";
import ScheduleContent from "@/components/content/schedule/ScheduleContent/ScheduleContent.vue";
import MingModal from "@/components/common/MingModal.vue";
import WeekContentDetail from "@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContentDetail.vue";
import { setDefaultTheme, getCurrentWeek } from "@/utils/common.js";
import { getTermDate } from "@/utils/getTermDate.js";
import { color } from "@/static/color/color.js";
import { setThemeColor } from "@/utils/common.js";
import {
  getStorageSync,
  filterSchedule,
  handleSchedule,
} from "@/utils/common.js";
import { getScheduleInfo } from "@/network/ssxRequest/ssxInfo/scheduleInfo.js";
import { ssxInfo } from "@/static/data/ssxData.js";
export default {
  setup() {
    const store = useStore();
    let allWeeks = ref([]);
    let currentWeek = ref(0);

    //用于实现页面的局部重载
    let keyValue = computed(() => {
      return store.state.common.keyValue;
    });

    const init = () => {
      let system = uni.getSystemInfoSync();
      if (system.platform == "ios") {
        uni.setStorageSync("schoolOpening", "2021/8/30");
      } else {
        uni.setStorageSync("schoolOpening", "2021.8.30");
      }
      allWeeks.value = getTermDate(getStorageSync("schoolOpening"));
      currentWeek.value = getCurrentWeek();
      uni.setStorageSync("platform", system.platform);
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
      store.commit("scheduleInfo/setPickWeek", { pickWeek: currentWeek });
      // store.commit("exam/setFutureExam", {
      //   futureExam: getStorageSync("futureExam"),
      // });
      setThemeColor("thinWhite", color.thinWhite);
    };

    let navInfo = computed(() => {
      return store.state.navInfo;
    });

    //遮罩层是否在显示
    let isShow = computed(() => {
      return store.state.scheduleInfo.isShow;
    });

    //从vuex里获取我获得的字符串的内容
    let showedScheduleInfo = computed(() => {
      return store.state.scheduleInfo.showedScheduleInfo;
    });

    const getThemeTextColor = computed(() => {
      return store.state.theme.curTextC;
    });

    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });
    onMounted(() => {
      init();
    });

    const close = (val) => {
      store.commit("scheduleInfo/setIsShow", { isShow: false });
    };

    return {
      navInfo,
      close,
      isShow,
      showedScheduleInfo,
      getThemeColor,
      getThemeTextColor,
      keyValue,
    };
  },
  components: {
    ScheduleTop,
    ScheduleContent,
    MingModal,
    WeekContentDetail,
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
