<template>
  <view>
    <scroll-view
      scroll-x
      class="select-week-scroll"
      scroll-with-animation
      :scroll-into-view="scrollCenter"
    >
      <view
        class="select-week-scroll-item"
        v-for="(item, index) of long"
        :key="index"
        @click="changeSelectWeek(index)"
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
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { getStorageSync } from "@/utils/common.js";

export default {
  setup() {
    let long = 20;
    let weekIndex = ref(getStorageSync("currentWeek"));
    let weeksData = getStorageSync("weeksData");
    const store = useStore();

    let getPickWeek = computed(() => {
      return store.state.scheduleInfo.pickWeek;
    });

    console.log(weeksData);
    console.log(",,,");
    let swiperList = ref([]);
    const changeSelectWeek = (index) => {
      weekIndex.value = index;
      store.commit("scheduleInfo/setPickWeek", { pickWeek: weekIndex.value });

      swiperList.value = [
        weeksData[getPickWeek.value],
        weeksData[getPickWeek.value + 1],
        weeksData[getPickWeek.value - 1],
      ];
      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList.value,
      });
    };

    onMounted(() => {});

    return { long, changeSelectWeek, weekIndex, getPickWeek };
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
    border: 1px solid red;
  }
}
</style>