<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>更新日志</div>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>更新日志</text> </template>
        <template v-slot:desc>
          <text>更新的信息在这里！</text>
        </template>
        <template v-slot:default>
          <view class="w-1"> 目前仍为初始版本，无更新记录 </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
export default {
  components: {
    Ztl,
    MingContainer,
  },
};
</script>

<style lang="scss" scoped>
</style>