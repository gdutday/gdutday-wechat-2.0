<template>
  <view
    class="wkd depth-3"
    :style="{
      background: `linear-gradient(360deg,${'#fff'} 35%,${getColor(
        showedScheduleInfo.id
      )} 50%)`,
    }"
  >
    <view class="wkd-container w-1">
      <view class="wkd-header">
        <view class="wkd-header-class">{{ showedScheduleInfo.cn }}</view>
        <view class="wkd-header-address">{{ showedScheduleInfo.ad }}</view>
      </view>
      <view class="wkd-info">
        <view class="wkd-info-teacher">{{ showedScheduleInfo.tn }}</view>
        <view class="wkd-info-time">{{ getClassTime }}</view>
        <view class="wkd-info-classInfo depth-1">
          <scroll-view
            scroll-y
            scroll-with-animation
            :scroll-into-view="scrollCenter"
            class="scroll-view"
          >
            <view class="wkd-info-classInfo-info">{{
              showedScheduleInfo.cc
            }}</view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed } from "vue";
import { getStorageSync, getColor } from "@/utils/common.js";
export default {
  props: {
    showedScheduleInfo: {
      type: Object,
      default: () => {},
    },
    bgColor: {
      type: String,
      default: "#000",
    },
  },
  setup(props, { emit }) {
    let time = [
      "8:30",
      "10:15",
      "10:35",
      "12:00",
      "13:50",
      "14:40",
      "16:15",
      "14:30",
      "18:05",
      "18:30",
      "20:05",
      "20:55",
    ];
    const getClassTime = computed(() => {
      if (props.showedScheduleInfo.cs) {
        let sT = props.showedScheduleInfo.cs.map((ele) => {
          return +ele < 10 ? ele.slice(-1) : ele;
        });
        let beginIndex = sT[0] - 1;
        let endIndex = sT[sT.length - 1] - 1;

        return `${time[beginIndex]}-${time[endIndex]}`;
      } else {
        return;
      }
    });

    return {
      getClassTime,
      getColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.wkd {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-width: 350px;
  padding: 35px;
  border: 1px solid transparent;
  border-radius: 25rpx;

  .wkd-container {
    display: flex;
    flex-direction: column;

    .wkd-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 40rpx;
      padding-top: 20rpx;

      .wkd-header-class {
        font-weight: 600;
        max-width: 70%;
        font-size: 30px;
      }
    }

    .wkd-info {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .wkd-info-classInfo {
        height: 120px;
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 35rpx;

        .scroll-view {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>