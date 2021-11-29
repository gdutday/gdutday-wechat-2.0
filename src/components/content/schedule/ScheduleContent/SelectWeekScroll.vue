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
    const store = useStore();

    const changeSelectWeek = (index) => {
      weekIndex.value = index;
      store.commit("scheduleInfo/setPickWeek", { pickWeek: weekIndex.value });

      // if (getCurrentIndex.value == getBeforeIndex.value) {
      //   console.log(weeksData.value[getPickWeek.value]);
      //   console.log(swiperList.value[getCurrentIndex.value]);
      //   swiperList.value[getCurrentIndex.value] =
      //     weeksData.value[getPickWeek.value];
      // } else {
      //   swiperList.value[getCurrentIndex.value] =
      //     weeksData.value[getPickWeek.value];
      //   swiperList.value[getBeforeIndex.value] =
      //     weeksData.value[getPickWeek.value + 1];
      //   swiperList.value[3 - getBeforeIndex.value - getCurrentIndex.value] =
      //     weeksData.value[getPickWeek.value - 1];
      // }

      if (getCurrentIndex.value == getBeforeIndex.value) {
        swiperList.value = [
          weeksData.value[getPickWeek.value],
          weeksData.value[getPickWeek.value + 1],
          weeksData.value[getPickWeek.value - 1],
        ];
      }
      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList.value,
      });

      console.log(
        "当前页面是第" + swiperList.value[getCurrentIndex.value][7] + "周"
      );
    };

    onMounted(() => {
      console.log(store.state.scheduleInfo);
    });

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
    color: red;
  }
}
</style>