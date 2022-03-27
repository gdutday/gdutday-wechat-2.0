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
          :class="[
            isClassPast(schedule) ? 'class-past' : '',
            indexOfItem == curIndex ? 'animation-ripple' : '',
          ]"
          :key="indexOfItem"
          :style="{
            height: `calc(${schedule.cs.length}*100%/12 - 10px)`,
            top: `calc(${schedule.cs[0] - 1}*100%/12)`,
            background: getEachClassBackground(
              isClassPast(schedule),
              schedule.id
            ),
          }"
          @tap="showDetail(schedule)"
          @touchstart="touchStart(schedule)"
          @touchend="touchEnd"
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
    themeColor: {
      type: Object,
      default: () => {},
    },
  },

  setup(props) {
    const store = useStore();
    let curIndex = ref(-1);

    const changArr = (val) => val.split(",");

    const getPickWeek = computed(() => store.state.scheduleInfo.pickWeek);

    //获取当前周数
    const getCurrentWeek = computed(() => {
      return store.state.scheduleInfo.currentWeek + 1; //此处的currentWeek不是index,而是真实周数
    });

    const showDetail = computed(() => {
      return (schedule) => {
        store.commit("scheduleInfo/setIsShow", { isShow: true });
        store.commit("scheduleInfo/setShowedScheduleInfo", {
          showedScheduleInfo: schedule,
        });
      };
    });

    //获取每一节课的背景颜色
    const getEachClassBackground = (isClassPast, colorId) => {
      if (isClassPast)
        return `linear-gradient(
          360deg,
          #fff 10%,
          rgba(199, 199, 199, ${props.themeColor.opacity}) 55%
        ) !important;`;
      else
        return `linear-gradient(360deg,rgba(255,255,255,${
          props.themeColor.opacity
        }) 10%,${getColor(colorId)} 55%)
                `;
    };

    //判断课程是否通过
    const isClassPast = computed(() => {
      return (schedule) => {
        let { cs, w, wd } = schedule; //cs是课程占的时长，w是周数
        if (+new Date() < +new Date(openningDate())) return false;
        if (w < getCurrentWeek.value) return true;

        let beginTime = getClassTime(cs, time, true).split("-")[0];
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

    const touchStart = (index) => {
      curIndex.value = index;
    };

    const touchEnd = () => {
      curIndex.value = -1;
    };

    return {
      //getHeightTop,
      getEachClassBackground,
      changArr,
      showDetail,
      getColor,
      isClassPast,
      getPickWeek,
      curIndex,
      touchStart,
      touchEnd,
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
  color: rgba(0, 0, 0, 0.7) !important;
}
</style>