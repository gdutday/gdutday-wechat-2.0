<template>
  <view
    class="openpage transition-2 opacity-9 py-4 px-3 rounded-4 depth-ming w-100"
    :style="{
      zIndex: 99999,
      top: toastIsShow ? 0 : '-1000px',
      backgroundImage: `url(${picUrl})`,
    }"
    @tap="close"
  >
    <view class="position-relative content rounded-4 px-4 py-3 w-1">
      <view class="toast-title"
        ><view class="fw-2 my-2">{{ title }}</view></view
      >
      <view class="mt-2">{{ content }}</view>
      <view class="decration position-absolute flex-center">“</view>
    </view>
  </view>
</template>

<script>
import { onMounted } from "vue";
export default {
  props: {
    title: {
      type: String,
      default: "我爱LYB",
    },
    content: {
      type: String,
      default: "一区白银三，求虐，求暴打",
    },
    picUrl: {
      type: String,
      default:
        "https://gitee.com/zhang-mingyuan123/pic/raw/bc1941ef2bf48910d3ddda00af18ec72c9ab241f/acd3c31bd2b19168c5d168240a6e7d7.jpg",
    },
    toastIsShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };

    onMounted(() => {
      //2s后自动折叠
      setTimeout(() => {
        close();
      }, 2000);
    });

    return {
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
.openpage {
  position: absolute;

  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background-repeat: no-repeat;
  background-size: cover;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 0.7);

    .toast-title {
      font-size: 40px;
    }

    .decration {
      text-align: center;
      height: 120px;
      top: -30%;
      line-height: 120px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 120px;
    }
  }
}
</style>