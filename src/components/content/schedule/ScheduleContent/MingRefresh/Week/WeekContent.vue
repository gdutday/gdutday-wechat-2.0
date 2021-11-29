<template>
  <view class="w-1 h-1">
    <view class="week-content-container w-1 h-1">
      <view
        v-for="(item, index) of weekContent"
        :key="index"
        class="week-content-container-info h-1"
      >
        <view
          class="week-content-container-info-child w-1"
          v-for="(schedule, indexOfItem) of item"
          :key="indexOfItem"
          :style="{
            height: `calc(${schedule.clazzSection.length}*100%/12 - 10px)`,
            top: `calc(${schedule.clazzSection[0] - 1}*100%/12)`,
            margin: '0 0 10px 0',
            backgroundColor: 'red',
          }"
          @tap="showDetail(schedule)"
        >
          <!-- 这一层是更内部 用来设置遮罩层 -->
          <view class="week-content-container-info-child-container h-1">
            <view class="week-content-container-info-child-i h-1">
              <!-- 这一块是页面的显示part -->
              <view class="text-xs">{{ schedule.clazzName }}</view>
              <view class="text-xxs">{{ schedule.address }}</view>
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

    const changArr = (val) => {
      let arr = [];
      arr = val.split(",");
      return arr;
    };

    const getHeightTop = computed(() => {
      return (arr) => {
        //这个数据是section的数组
        return {
          height: `calc(${arr.length} * 100% / 12 - 10px)`,
          top: `calc(${arr[0] - 1} *100% / 12)`,
          margin: "0px 0px 10px 0px",
        };
      };
    });

    const showDetail = (schedule) => {
      console.log(schedule);
      store.commit("scheduleInfo/setIsShow", { isShow: true });
      store.commit("scheduleInfo/setShowedScheduleInfo", {
        showedScheduleInfo: schedule,
      });
      console.log(store.state.scheduleInfo.isShow);
    };

    return {
      getHeightTop,
      changArr,
      showDetail,
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
    .week-content-container-info-child {
      position: absolute;
      width: 95%;
      padding: 8px 6px;
      border-radius: 15px;

      .week-content-container-info-child-container {
        .week-content-container-info-child-i {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }
      }
    }
  }
}
</style>