<template>
  <view class="content">
    <schedule-top
      class="scheduletop"
      :navInfo="navInfo"
      :style="{ height: navInfo.allHeight + 'px' }"
    ></schedule-top>
    <schedule-content class="schedule-content"></schedule-content>
    <ming-modal @close="close" :isShow="isShow">
      <template v-slot:default>
        <week-content-detail
          :showedScheduleInfo="showedScheduleInfo"
        ></week-content-detail>
      </template>
    </ming-modal>
  </view>
</template>

<script>
import { ref, toRefs, computed, onMounted } from "vue";
import { useStore } from "vuex";
import ScheduleTop from "@/components/content/schedule/ScheduleTop.vue";
import ScheduleContent from "@/components/content/schedule/ScheduleContent/ScheduleContent.vue";
import MingModal from "@/components/common/MingModal.vue";
import WeekContentDetail from "@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContentDetail.vue";
import { setDefaultTheme, getCurrentWeek } from "@/utils/common.js";
import { getTermDate } from "@/utils/getTermDate.js";
import {
  getStorageSync,
  filterSchedule,
  handleSchedule,
} from "@/utils/common.js";
import { getScheduleInfo } from "@/network/ssxRequest/ssxInfo/scheduleInfo.js";
import { ssxInfo } from "@/static/data/ssxData.js";
export default {
  setup() {
    let allWeeks = ref([]);
    let system = uni.getSystemInfoSync();
    let menu = uni.getMenuButtonBoundingClientRect();
    let currentWeek = ref(0);

    const store = useStore();
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
    currentWeek.value = getCurrentWeek();
    allWeeks.value = getTermDate(getStorageSync("schoolOpening"));

    store.commit("scheduleInfo/setCurrentWeek", {
      currentWeek: currentWeek.value,
    });
    store.commit("scheduleInfo/setAllWeeks", { allWeeks: allWeeks.value });
    store.commit("scheduleInfo/setPickWeek", { pickWeek: currentWeek });

    uni.setStorageSync("schoolOpening", "2021.8.30");

    onMounted(() => {
      setDefaultTheme("dark");
    });

    const close = (val) => {
      store.commit("scheduleInfo/setIsShow", { isShow: false });
    };

    const init = () => {
      // uni.showLoading({
      //   title: "加载中",
      // });
      //********************************************************** */
      // getScheduleInfo(getStorageSync("jSessionId"))
      //   .then((res, req) => {
      //     console.log(res);
      //     console.log(getStorageSync("jSessionId"));
      //     let weeksData = filterSchedule(res.data.data);
      //     handleSchedule(weeksData, currentWeek.value);
      //     uni.setStorageSync("weeksData", weeksData);
      //     //此时登陆成功
      //     //从服务端获取的数据被拿去存储到
      //     uni.hideLoading();
      //     uni.showToast({
      //       title: "收获课表陈坤",
      //       duration: 2000,
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     uni.hideLoading();
      //     uni.showToast({
      //       title: "收获课表寄寄",
      //       duration: 2000,
      //       icon: "error",
      //     });
      //   });
      //***************************************************************** */
      uni.setStorageSync("schoolOpening", "2021.8.30");
      let weeksData = ssxInfo().filter((item, index) => {
        return index < 20;
      });
      let arr1 = [];
      for (let i = 0; i < weeksData.length; i++) {
        let arr = [[], [], [], [], [], [], []];
        for (let j = 0; j < weeksData[i].length; j++) {
          let classInfo = weeksData[i][j];
          arr[--classInfo.weekdays].push(classInfo);
        }
        arr1.push(arr);
      }
      weeksData = arr1;
      // weeksData.forEach((element, index) => {
      //   element.push(index + 1);
      // });
      for (let i = 0; i < weeksData.length; i++) {
        for (let j = 0; j < weeksData[i].length; j++) {
          for (let k = 0; k < weeksData[i][j].length; k++) {
            weeksData[i][j][k].clazzSection =
              weeksData[i][j][k].clazzSection.split(",");
          }
        }
      }
      //此时登陆成功
      //从服务端获取的数据被拿去存储到
      uni.setStorage({
        key: "weeksData",
        data: weeksData,
        success: function () {
          console.log("success");
        },
      });
      store.commit("scheduleInfo/setSchedule", { schedule: weeksData });
      uni.hideLoading();
      //******************************************************** */
    };
    init();

    store.commit("navInfo/setnavInfo", {
      zltHeight: system.statusBarHeight, //状态栏高度
      navHeight: (menu.top - system.statusBarHeight) * 2 + menu.height, //导航栏高度
      jnHeight: menu.height, //胶囊高度
      wdHeight: system.windowHeight,
      wdWdith: system.windowWidth,
    });

    return {
      navInfo,
      close,
      isShow,
      showedScheduleInfo,
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .scheduletop {
    width: 100%;
  }

  .schedule-content {
    width: 100%;
    height: 100%;
  }
}
</style>
