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
          class="selectday-day-info-item flex-center p rounded-circle"
          :style="{
            backgroundColor:
              getNowWeeks.month == month && date == getNowWeeks.daysCount[index]
                ? themeColor.curBgSecond
                : '',

            color:
              getNowWeeks.month == month && date == getNowWeeks.daysCount[index]
                ? themeColor.curTextC
                : '',
          }"
          >{{ item }}</text
        >
      </view>
    </view>
  </view>
</template>

<script>
import { onMounted, ref, computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";

export default {
  props: {
    themeColor: {
      type: Object,
    },
  },
  setup(props) {
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

      .selectday-day-info-item {
        height: 15px;
        width: 15px;
      }
    }
  }
}

.today {
  width: 30%;
  height: 70%;

  border-bottom: 2px solid red;
}
</style>