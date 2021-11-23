<template>
  <view class="select-week">
    <Ripple
      class="ripple"
      @tap="selectWeekisValue = !selectWeekisValue"
    ></Ripple>
    <view class="select-week-content" v-if="selectWeekisValue">
      <view class="select-week-content-item">
        {{ `${getCurrentWeek + 1}` + "周" }}
      </view>
      <view
        class="select-week-content-item"
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
  background-color: yellowgreen;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .ripple {
    width: 50rpx;
    z-index: 10;
    border-right: 1px solid #ccc;
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