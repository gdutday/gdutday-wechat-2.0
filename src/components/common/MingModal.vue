<template>
  <view>
    <view class="modal" v-if="isShow" @touchmove.stop>
      <view class="modal-mask" @click="close"></view>
      <view class="animation-fade flex-center">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
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
  z-index: 999999;

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
    overflow: auto;
  }
}
</style>