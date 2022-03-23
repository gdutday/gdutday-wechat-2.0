<template>
  <view class="w-1">
    <wave-header :title="type"></wave-header>
    <sa-table :type="type" class="w-1 flex-center"></sa-table>
  </view>
</template>

<script>
import WaveHeader from "@/components/common/WaveHeader";
import SaTable from "@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/Exetention/SpiritedAway/SaTable";
export default {
  components: {
    WaveHeader,
    SaTable,
  },
  props: {
    type: String,
  },
  setup(props) {
    console.log(props);
  },
};
</script>

<style lang="scss" scoped>
</style>