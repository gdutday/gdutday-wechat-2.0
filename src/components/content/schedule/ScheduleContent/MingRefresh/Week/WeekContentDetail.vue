<template>
  <view
    class="wkd depth-3"
    :style="{ background: `linear-gradient(${'#fab9b9'}, ${'#fff'})` }"
  >
    <view class="wkd-container w-1">
      <view class="wkd-header">
        <view class="wkd-header-class text-xxl text-danger">{{
          showedScheduleInfo.clazzName
        }}</view>
        <view class="wkd-header-address text-dark">{{
          showedScheduleInfo.address
        }}</view>
      </view>
      <view class="wkd-info">
        <view class="wkd-info-teacher">{{
          showedScheduleInfo.teacherName
        }}</view>
        <view class="wkd-info-time">{{ getClassTime }}</view>
        <view class="wkd-info-classInfo">
          <scroll-view
            scroll-y
            scroll-with-animation
            :scroll-into-view="scrollCenter"
            class="scroll-view"
          >
            <view class="wkd-info-classInfo-info">{{
              showedScheduleInfo.clazzContent
            }}</view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed } from "vue";
import { toNumber } from "@vue/shared";
export default {
  props: {
    showedScheduleInfo: {
      type: Object,
      default: () => {},
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
      if (props.showedScheduleInfo.clazzSection) {
        let sT = props.showedScheduleInfo.clazzSection.map((ele) => {
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
  width: 500rpx;
  padding: 35rpx;
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
      margin-bottom: 40rpx;
      margin-top: 20rpx;

      .wkd-header-class {
        font-weight: 600;
        max-width: 70%;
      }
    }

    .wkd-info {
      height: 400rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .wkd-info-classInfo {
        height: 200rpx;
        background-color: #f5f5f5;
        padding: 35rpx;
        border-radius: 30rpx;

        .scroll-view {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>