<template>
  <view
    class="toast depth-ming p-3 opacity-9 rounded-2"
    :style="{ zIndex: 999, top: '35px' }"
  >
    <view
      ><h2 class="small-title-font fw-2">{{ toastType }}</h2></view
    >
    <view class="mt-2">{{ content }}</view>
  </view>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    toastType: {
      type: String,
      default: "已完成",
    },
    content: {
      type: String,
      default: "这里是toast里的内容",
    },
  },
  setup(props) {
    const store = useStore();
    const toastTypeChinese = ["已完成", "警告"];
    const content = ref("");

    return { ...props };
  },
};
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  height: 85px;
  width: 300px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
</style>