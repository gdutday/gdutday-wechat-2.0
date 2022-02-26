<template>
  <view
    class="wkd depth-ming"
    :style="{
      background: `linear-gradient(20deg,${'#fff'} 30%,${getColor(
        showedScheduleInfo.id
      )} 70%)`,
    }"
  >
    <view class="wkd-container w-1">
      <view class="wkd-header">
        <view class="wkd-header-class web-font fw-05">{{
          showedScheduleInfo.cn
        }}</view>
        <view class="wkd-header-address">
          <text class="iconfont icon-icon-test21 pr-1"></text>
          {{ showedScheduleInfo.ad }}
        </view>
      </view>
      <view class="wkd-info">
        <view class="wkd-info-teacher">
          <text class="iconfont icon-icon-test19 pr-1"></text>
          {{ showedScheduleInfo.tn }}</view
        >
        <view class="wkd-info-time">
          <text class="iconfont icon-icon-test5 pr-1"></text
          >{{ _getClassTime }}</view
        >
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
import { getStorageSync, getColor, getClassTime } from "@/utils/common.js";
import { time } from "@/static/time.js";
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
    const _getClassTime = computed(() =>
      props.showedScheduleInfo.cs
        ? getClassTime(props.showedScheduleInfo.cs, time)
        : ""
    );

    return {
      _getClassTime,
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
  width: 75%;
  max-width: 350px;
  padding: 35px;
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
        font-size: 30px;
        flex: 1;
      }
      .wkd-header-address {
        min-width: 80px;
        max-width: 80px;
      }
    }

    .wkd-info {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .wkd-info-classInfo {
        height: 120px;

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