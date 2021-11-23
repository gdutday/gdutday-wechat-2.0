<template>
  <view class="ztl"></view>
</template>

<script>
import { computed } from "vue";
export default {
  setup() {
    let navInfo = computed(() => {
      return store.state.navInfo;
    });

    return {
      navInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>