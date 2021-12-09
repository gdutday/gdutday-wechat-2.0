<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>用户隐私条款</div>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>用户服务条款</text> </template>
        <template v-slot:desc>
          <text>这里是用户服务条款，请认真阅读</text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            <rich-text :nodes="privacy"></rich-text>
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import { privacy } from "@/static/staticData/privacy.js";
export default {
  components: {
    Ztl,
    MingContainer,
  },
  setup() {
    return {
      privacy,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>