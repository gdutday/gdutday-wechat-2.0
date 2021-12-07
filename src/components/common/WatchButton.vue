<template>
  <view class="w-1 h-1">
    <view
      class="simple-button transition-2 flex-center"
      :class="[show ? 'simple-button--tap animation-shake' : '', 'h-1', 'w-1']"
      @tap="handleTap"
    >
      {{ value }}
    </view>
  </view>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    value: {
      type: String,
    },
  },
  setup(props) {
    let show = ref(false);
    const handleTap = () => {
      console.log(111);
      show.value = true;
      setTimeout(() => {
        console.log(222);
        show.value = false;
      }, 1000);
    };

    return {
      handleTap,
      show,
    };
  },
};
</script>

<style lang="scss" scoped>
.simple-button {
  border: 2px solid #ccc;
  border-radius: 40px;
}

.simple-button--tap {
  border: 2px solid #17a2b8 !important;
}
</style>