<template>
  <view class="mw">
    <view class="mw-wave">
      <wave :themeColor="getThemeColor"></wave>
    </view>
    <view class="mw-banben">
      <my-welcome-info :themeColor="getThemeColor"></my-welcome-info>
    </view>
  </view>
</template>

<script>
import Wave from "@/components/common/Wave.vue";
import MyWelcomeInfo from "@/components/content/profile/my/MyWelcomeInfo.vue";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  components: {
    Wave,
    MyWelcomeInfo,
  },
  setup() {
    const store = useStore();
    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    return { getThemeColor };
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