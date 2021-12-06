<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <view>关于我们</view>
      </template>
    </Ztl>
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
export default {
  components: {
    Ztl,
  },
};
</script>

<style lang="scss" scoped>
</style>