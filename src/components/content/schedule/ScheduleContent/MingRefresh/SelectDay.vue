<template>
  <!-- 用来挑选日子 -->
  <view class="selectday w-1 py-1">
    <view class="selectday-month flex-center">{{
      getNowWeeks.month + "月"
    }}</view>
    <view class="selectday-day">
      <view
        v-for="(item, index) of getNowWeeks.daysCount"
        :key="index"
        class="selectday-day-info flex-center"
      >
        <text
          class="item flex-center"
          :class="
            getNowWeeks.month == month && date == getNowWeeks.daysCount[index]
              ? 'today'
              : ''
          "
          >{{ item }}</text
        >
      </view>
    </view>
  </view>
</template>

<script>
import { onMounted, ref, computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { getTermDate } from "@/utils/getTermDate.js";
import { getStorageSync } from "@/utils/common.js";
export default {
  setup() {
    const store = useStore();
    let weekInfo = reactive({
      month: 0,
      daysCount: [],
    });

    let getNowWeeks = computed(() => {
      return store.state.scheduleInfo.nowWeeks;
    });
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;

    onMounted(() => {
      // let dog = computed(() => {
      //   return store.state.scheduleInfo;
      // });
      // console.log(dog.value);
      // nowWeek.value = dog.value.allWeeks[dog.value.currentWeek];
      // console.log("-------------------");
      // console.log(nowWeek.value);
      // console.log("-------------------");
      // weekInfo.month = nowWeek.value.month;
      // weekInfo.daysCount = nowWeek.value.daysCount;
    });

    return { ...toRefs(weekInfo), getNowWeeks, month, date };
  },
};
</script>

<style lang="scss" scoped>
.selectday {
  display: flex;
  flex-direction: row;
  height: 32px;

  .selectday-month {
    width: 50rpx;
    font-size: 0.8em;
  }
  .selectday-day {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .selectday-day-info {
      flex: 1;
    }
  }
}

.today {
  width: 30%;
  height: 70%;

  border-bottom: 2px solid red;
}
</style>