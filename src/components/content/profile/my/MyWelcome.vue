<template>
  <view class="mw">
    <view class="mw-wave">
      <wave></wave>
    </view>
    <view class="mw-banben">
      <my-welcome-info></my-welcome-info>
    </view>
  </view>
</template>

<script>
import Wave from "@/components/common/Wave.vue";
import MyWelcomeInfo from "@/components/content/profile/my/MyWelcomeInfo.vue";
export default {
  components: {
    Wave,
    MyWelcomeInfo,
  },
};
</script>

<style lang="scss" scoped>
.mw {
  height: 100%;

  .mw-wave {
    height: 60%;
  }

  .mw-banben {
    height: 40%;
  }
}
</style>