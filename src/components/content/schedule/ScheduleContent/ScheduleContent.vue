<template>
  <view class="schedule-content">
    <select-week class="select-week"></select-week>
    <ming-refresh class="ming-refresh"></ming-refresh>
  </view>
</template>

<script>
import SelectWeek from "@/components/content/schedule/ScheduleContent/SelectWeek.vue";
import MingRefresh from "@/components/content/schedule/ScheduleContent/MingRefresh/MingRefresh.vue";
export default {
  setup() {},
  components: {
    SelectWeek,
    MingRefresh,
  },
};
</script>

<style lang="scss" scoped>
.schedule-content {
  width: 100%;
  height: 100%;

  .select-week {
    height: 40px;
    width: 100%;
    background-color: green;
  }

  .ming-refresh {
    height: 100%;
  }
}
</style>