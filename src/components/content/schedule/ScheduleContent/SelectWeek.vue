<template>
  <view
    class="select-week postion-relative depth-4"
    :style="{ backgroundColor: getThemeColor }"
  >
    <Ripple
      class="ripple"
      @tap="selectWeekisValue = !selectWeekisValue"
    ></Ripple>
    <view
      class="select-week-content animation-slide-top"
      v-if="selectWeekisValue"
    >
      <view class="select-week-content-item">
        {{ `${getCurrentWeek + 1}` + "周" }}
      </view>
      <view
        class="select-week-content-item"
        :style="{ fontSize: '26rpx' }"
        v-for="(item, index) in weekInfo"
        :key="index"
        >{{ item }}
      </view>
    </view>
    <select-week-scroll
      class="select-week-content h-1"
      v-else
    ></select-week-scroll>
  </view>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Ripple from "@/components/common/Ripple.vue";
import SelectWeekScroll from "@/components/content/schedule/ScheduleContent/SelectWeekScroll.vue";
export default {
  setup() {
    const weekInfo = ["周二", "周三", "周四", "周五", "周六", "周日"];
    const store = useStore();
    let selectWeekisValue = ref(true);
    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });

    // let pickWeek = ref(0);

    // watch(pickWeek, () => {
    //   console.log("改变了");
    // });
    // onMounted(() => {
    //   pickWeek.value = store.state.scheduleInfo.pickWeek;
    //   console.log(pickWeek);
    // });

    const getCurrentWeek = computed(() => {
      return store.state.scheduleInfo.pickWeek;
    });

    return {
      weekInfo,
      selectWeekisValue,
      getCurrentWeek,
      getThemeColor,
    };
  },
  components: {
    Ripple,
    SelectWeekScroll,
  },
};
</script>

<style lang="scss" scoped>
.select-week {
  position: relative;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;

  .ripple {
    width: 50rpx;
    z-index: 10;
  }

  .select-week-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .select-week-content-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
  }
}
</style>