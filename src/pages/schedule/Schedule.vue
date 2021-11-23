<template>
  <view class="content">
    <schedule-top
      class="scheduletop"
      :navInfo="navInfo"
      :style="{ height: navInfo.allHeight + 'px' }"
    ></schedule-top>
    <schedule-content class="schedule-content"></schedule-content>
  </view>
</template>

<script>
import { ref, toRefs, computed, onMounted } from "vue";
import { useStore } from "vuex";
import ScheduleTop from "@/components/content/schedule/ScheduleTop.vue";
import ScheduleContent from "@/components/content/schedule/ScheduleContent/ScheduleContent.vue";
import { setDefaultTheme, getCurrentWeek } from "@/utils/common.js";
import { getTermDate } from "@/utils/getTermDate.js";
import { getStorageSync } from "@/utils/common.js";
export default {
  setup() {
    let allWeeks = ref([]);
    let system = uni.getSystemInfoSync();
    let menu = uni.getMenuButtonBoundingClientRect();
    let currentWeek = ref(0);
    const store = useStore();
    console.log(system);

    currentWeek.value = getCurrentWeek();
    allWeeks.value = getTermDate(getStorageSync("schoolOpening"));

    store.commit("scheduleInfo/setCurrentWeek", {
      currentWeek: currentWeek.value,
    });
    store.commit("scheduleInfo/setAllWeeks", { allWeeks: allWeeks.value });
    store.commit("scheduleInfo/setPickWeek", { pickWeek: currentWeek });

    onMounted(() => {
      setDefaultTheme("dark");
    });

    store.commit("navInfo/setnavInfo", {
      zltHeight: system.statusBarHeight, //状态栏高度
      navHeight: (menu.top - system.statusBarHeight) * 2 + menu.height, //导航栏高度
      jnHeight: menu.height, //胶囊高度
      wdHeight: system.windowHeight,
      wdWdith: system.windowWidth,
    });

    let navInfo = computed(() => {
      return store.state.navInfo;
    });

    return {
      navInfo,
    };
  },
  components: {
    ScheduleTop,
    ScheduleContent,
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
    background-color: yellow;
  }
}
</style>
