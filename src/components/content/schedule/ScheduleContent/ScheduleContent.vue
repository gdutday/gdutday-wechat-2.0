<template>
  <view class="schedule-content">
    <select-week class="select-week"></select-week>
    <ming-refresh class="ming-refresh" @longtap="openScheduleSelector"></ming-refresh>
    <schedule-selector v-if="isScheduleSelectorOpen" @close="openScheduleSelector"></schedule-selector>
  </view>
</template>

<script>
import { ref } from 'vue'
import SelectWeek from '@/components/content/schedule/ScheduleContent/SelectWeek.vue'
import ScheduleSelector from '@/components/content/schedule/ScheduleContent/ScheduleSelector'
import MingRefresh from '@/components/content/schedule/ScheduleContent/MingRefresh/MingRefresh.vue'
export default {
  setup() {
    const isScheduleSelectorOpen = ref(true)
    const openScheduleSelector = () => {
      isScheduleSelectorOpen.value = !isScheduleSelectorOpen.value
      console.log('hahah')
    }

    return {
      isScheduleSelectorOpen,
      openScheduleSelector,
    }
  },
  components: {
    SelectWeek,
    MingRefresh,
    ScheduleSelector,
  },
}
</script>

<style lang="scss" scoped>
.schedule-content {
  width: 100%;
  height: 100%;
  position: relative;

  .select-week {
    height: 40px;
    width: 100%;
  }

  .ming-refresh {
    height: 100%;
  }
}
</style>
