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
        <view class="select-week-scroll-item-info flex-center"
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
    let getBeforeIndex = computed(() => {
      return store.state.scheduleInfo.beforeIndex;
    });

    let getCurrentIndex = computed(() => {
      return store.state.scheduleInfo.currentIndex;
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
      console.log(event);
      //setScrollLeft(event.target.offsetLeft, index);
      weekIndex.value = index;
      store.commit("scheduleInfo/setPickWeek", { pickWeek: weekIndex.value });
      if (getCurrentIndex.value == getBeforeIndex.value) {
        swiperList.value = [
          weeksData.value[getPickWeek.value],
          weeksData.value[getPickWeek.value + 1],
          weeksData.value[getPickWeek.value - 1],
        ];
      } else {
        swiperList.value = [0, 0, 0];
        store.commit("scheduleInfo/setIndex", {
          beforeIndex: getCurrentIndex.value,
          currentIndex: getCurrentIndex.value,
        });
        swiperList.value[getCurrentIndex.value] =
          weeksData.value[getPickWeek.value];
      }
      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList.value,
      });
      console.log(
        "当前页面是第" + swiperList.value[getCurrentIndex.value][7] + "周"
      );
    };

    onMounted(() => {
      scrollLeft.value = (getPickWeek.value - 1) * scrollLeftOne * 2;
    });

    return { long, changeSelectWeek, weekIndex, getPickWeek, scrollLeft };
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
    color: red;
  }
}
</style>