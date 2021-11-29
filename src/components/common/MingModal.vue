<template>
  <view>
    <view class="modal" v-if="isShow">
      <view class="modal-mask" @click="close"></view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const store = useStore();

    const close = () => {
      emit("close");
    };

    return { close };
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 0;

  &,
  &-mask {
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  &-mask {
    position: absolute;
    z-index: -1;
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>