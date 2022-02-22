<template>
  <view>
    <scroll-view
      scroll-x
      class="select-week-scroll"
      scroll-with-animation
      :scroll-left="scrollLeft + 'px'"
      :scroll-into-view="scrollCenter"
    >
      <view
        class="select-week-scroll-item transition-2"
        v-for="(item, index) of long"
        :key="index"
        @click="changeSelectWeek($event, index)"
        :class="{ active: getPickWeek == index }"
      >
        <view
          class="select-week-scroll-item-info flex-center"
          :style="{
            backgroundColor:
              getPickWeek == index
                ? getThemeColor.curBgSecond
                : getThemeColor.curBg,
          }"
          >{{ index + 1 }} 周</view
        >
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { getStorageSync, changeRpxToPx } from "@/utils/common.js";

export default {
  setup() {
    let long = 20;
    let weekIndex = ref(getStorageSync("currentWeek"));
    let weeksData = computed(() => {
      return store.state.scheduleInfo.schedule;
    });
    let swiperList = ref([0, 0, 0]);
    let getPickWeek = computed(() => {
      return store.state.scheduleInfo.pickWeek;
    });
    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    let getCurrentSwiperIndex = computed(() => {
      return store.state.scheduleInfo.currentSwiperIndex;
    });

    let scrollLeft = ref("0");
    let scrollLeftOne = changeRpxToPx(40);

    const store = useStore();

    watch(
      () => getPickWeek.value,
      () => {
        scrollLeft.value = (getPickWeek.value - 1) * scrollLeftOne * 2;
      }
    );

    const changeSelectWeek = (event, index) => {
      store.commit("scheduleInfo/setPickWeek", {
        pickWeek: index,
      });

      swiperList.value[getCurrentSwiperIndex.value] =
        weeksData.value[getPickWeek.value];
      swiperList.value[(getCurrentSwiperIndex.value + 1) % 3] =
        weeksData.value[(getPickWeek.value + 1) % 20];
      swiperList.value[(getCurrentSwiperIndex.value + 2) % 3] =
        weeksData.value[(20 + ((getPickWeek.value - 1) % 20)) % 20];

      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList.value,
      });
    };

    onMounted(() => {
      scrollLeft.value = (getPickWeek.value - 1) * scrollLeftOne * 2;
    });

    return {
      long,
      changeSelectWeek,
      weekIndex,
      getPickWeek,
      scrollLeft,
      getThemeColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.select-week-scroll {
  width: calc(100% - 50rpx);
  height: 80rpx;
  line-height: 80rpx;
  white-space: nowrap;
  position: absolute;
  top: 0;
  overflow: scroll;

  .select-week-scroll-item {
    width: 100.1rpx;
    display: inline-block;
    overflow: scroll;
  }
  .active {
    opacity: 0.7;
  }
}
</style>