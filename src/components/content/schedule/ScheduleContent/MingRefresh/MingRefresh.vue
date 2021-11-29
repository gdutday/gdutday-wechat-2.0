<template>
  <movable-area
    :style="{
      height: getWdHeight - getExeHeight + 'px',
    }"
    class="w-1"
    ref="dog"
  >
    <movable-view
      :y="0"
      animation
      damping="20"
      direction="all"
      class="w-1 movable-view"
      :style="{ height: getWdHeight + 'px' }"
    >
      <!-- 这一块用来写下拉菜单的拓展区 -->
      <view
        class="w-1"
        :style="{
          height: getExeHeight + 'px',
          border: 'red 1px solid',
        }"
      >
        <view class="w-1">
          <schedule-extention></schedule-extention>
        </view>
      </view>
      <view
        class="w-1 schedule-content"
        :style="{ height: getWdHeight - getExeHeight + 'px' }"
      >
        <select-day class="w-1"></select-day>
        <view
          class="w-1 schedule-content-container"
          :style="{ height: getWdHeight - getExeHeight - 32 + 'px' }"
        >
          <view class="schedule-content-left left-width h-1">
            <text
              v-for="(item, index) of long"
              :key="index"
              class="flex-center"
              >{{ item + 1 }}</text
            >
          </view>
          <view class="schedule-swiper h-1 w-1">
            <schedule-swiper class="h-1 w-1"></schedule-swiper>
          </view>
        </view>
      </view>
    </movable-view>
  </movable-area>
</template>

<script>
import { onMounted, ref, reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import ScheduleExtention from "@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/ScheduleExtention.vue";
import SelectDay from "@/components/content/schedule/ScheduleContent/MingRefresh/SelectDay.vue";
import ScheduleSwiper from "@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleSwiper.vue";
import { changeRpxToPx } from "@/utils/common.js";
export default {
  components: {
    ScheduleExtention,
    SelectDay,
    ScheduleSwiper,
  },
  setup() {
    const store = useStore();
    const long = 12;
    let pageSetting = reactive({
      y: 0,
    });

    let getWdHeight = computed(() => {
      return store.state.navInfo.wdHeight;
    });

    let getExeHeight = computed(() => {
      let px = changeRpxToPx(80);
      console.log(px);
      console.log(store.state.navInfo.allHeight + px);
      return store.state.navInfo.allHeight + px;
    });

    onMounted(() => {});

    return {
      long,
      ...toRefs(pageSetting),
      getWdHeight,
      getExeHeight,
    };
  },
};
</script>

<style lang="scss" scoped>
.movable-view {
  position: absolute;
  z-index: 3;

  .schedule-content {
    .schedule-content-selectday {
    }

    .schedule-content-container {
      display: flex;
      flex-direction: row;

      .schedule-content-left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .schedule-content-time {
          flex: 1;
        }
      }

      .schedule-swiper {
        flex: 1;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>