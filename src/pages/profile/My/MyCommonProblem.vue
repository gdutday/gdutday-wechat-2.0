<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>常见问题</div>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>用户常见问题</text> </template>
        <template v-slot:desc>
          <text
            >因为开发者也只是初学者，小程序有很多逆天与不足，在这里展示一些常见问题</text
          >
        </template>
        <template v-slot:default>
          <view class="w-1"> 暂时没写常见问题 </view>
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