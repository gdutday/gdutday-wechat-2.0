<template>
  <view
    class="content w-1 position-relative"
    :style="{ 'min-height': '100vh' }"
  >
    <Ztl>
      <template v-slot:navName>
        <div>我要上封面</div>
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