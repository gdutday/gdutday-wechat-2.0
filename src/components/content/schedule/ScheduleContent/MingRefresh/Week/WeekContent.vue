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
          v-for="(schedule, index) of item"
          :key="index"
          :style="{
            height: `calc(${schedule.clazzSection.length}*100%/12 - 10px)`,
            top: `calc(${schedule.clazzSection[0] - 1}*100%/12)`,
            margin: '0 0 10px 0 ',
            backgroundColor: 'red',
          }"
        >
          <!-- 这一层是更内部 用来设置遮罩层 -->
          <view class="week-content-container-info-child-container">
            <view class="week-content-container-info-child-i">
              <!-- 这一块是页面的显示part -->
              <view>{{ schedule.clazzName }}</view>
              <view>{{ schedule.address }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, onUpdated, watch } from "vue";
export default {
  props: {
    weekContent: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    onMounted(() => {
      console.log(props);
    });

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

    return {
      getHeightTop,
      changArr,
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
    border: 1px solid blue;
    font-size: 24rpx;
    position: relative;
    .week-content-container-info-child {
      position: absolute;

      .week-content-container-info-child-container {
      }
    }
  }
}
</style>