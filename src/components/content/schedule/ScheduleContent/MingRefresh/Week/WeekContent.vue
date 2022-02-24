<template>
  <view class="w-1 h-1">
    <view class="week-content-container w-1 h-1">
      <view
        v-for="(item, index) of weekContent.slice(0, 7)"
        :key="index"
        class="week-content-container-info h-1"
      >
        <view
          class="week-content-container-info-child w-1 depth-4 animation-fade"
          v-for="(schedule, indexOfItem) of item"
          :class="isClassPast(schedule) ? 'class-past' : ''"
          :key="indexOfItem"
          :style="{
            height: `calc(${schedule.cs.length}*100%/12 - 10px)`,
            top: `calc(${schedule.cs[0] - 1}*100%/12)`,
            background: `linear-gradient(360deg,${'#fff'} 30%,${getColor(
              schedule.id
            )} 70%)`,
            opacity: '0.85',
          }"
          @tap="showDetail(schedule)"
        >
          <!-- 这一层是更内部 用来设置遮罩层 -->
          <view class="week-content-container-info-child-container h-1">
            <view class="week-content-container-info-child-i h-1">
              <!-- 这一块是页面的显示part -->
              <view class="text-xxs week-content-container-info-child-i-cn">{{
                schedule.cn
              }}</view>
              <view class="text-xxs">{{ schedule.ad }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, onUpdated, watch, ref } from "vue";
import { useStore } from "vuex";
import { time, openningDate } from "@/static/time.js";
import {
  getStorageSync,
  getColor,
  getClassTime,
  myDate,
} from "@/utils/common.js";

export default {
  props: {
    weekContent: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const store = useStore();
    onMounted(() => {});

    const changArr = (val) => val.split(",");

    const showDetail = computed(() => {
      return (schedule) => {
        store.commit("scheduleInfo/setIsShow", { isShow: true });
        store.commit("scheduleInfo/setShowedScheduleInfo", {
          showedScheduleInfo: schedule,
        });
      };
    });

    const getCurrentWeek = computed(() => {
      return store.state.scheduleInfo.currentWeek + 1; //此处的currentWeek不是index,而是真实周数
    });

    const isClassPast = computed(() => {
      return (schedule) => {
        let { cs, w, wd } = schedule; //cs是课程占的时长，w是周数
        if (+new Date() < +new Date(openningDate())) return false;
        if (w < getCurrentWeek.value) return true;

        let beginTime = getClassTime(cs, time, true);
        let nowTime = "";
        wd++;
        let day = "7123456".charAt(new Date().getDay()); //胡哦的今天是星期几

        if (w == getCurrentWeek.value) {
          if (getStorageSync("platform") == "ios") {
            beginTime = +new Date("2001/12/17 " + beginTime);
            nowTime = +new Date(
              "2001/12/17 " +
                new Date().getHours() +
                ":" +
                new Date().getMinutes()
            );
          } else {
            beginTime = +new Date("2001-12-17 " + beginTime);

            nowTime = +new Date(
              "2001-12-17 " +
                new Date().getHours() +
                ":" +
                new Date().getMinutes()
            );
          }

          if (wd < day || (wd == day && beginTime < nowTime)) {
            return true;
          }
        }
      };
    });

    return {
      //getHeightTop,
      changArr,
      showDetail,
      getColor,
      isClassPast,
    };
  },
};
</script>

<style lang="scss" scoped>
.week-content-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .week-content-container-info {
    flex: 1;
    font-size: 24rpx;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .week-content-container-info-child {
      position: absolute;
      width: 90%;
      padding: 5px 4px;
      border-radius: 15px;

      .week-content-container-info-child-container {
        .week-content-container-info-child-i {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;

          .week-content-container-info-child-i-cn {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
    }
  }
}

.class-past {
  background: linear-gradient(
    360deg,
    #fff 30%,
    rgba(199, 199, 199, 0.85) 70%
  ) !important;
  color: rgba(0, 0, 0, 0.3) !important;
}
</style>