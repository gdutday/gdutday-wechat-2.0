<template>
  <view
    class="confirm position-absolute w-1 rounded-4 overflow-hidden depth-5"
    :style="{ border: `1px solid ${themeColor.curBgSecond}` }"
  >
    <view
      class="confirm-title flex-center title-font w-1 p-5 depth-2"
      :style="{
        color: themeColor.curTextC,
        backgroundColor: themeColor.curBg,
      }"
      >{{ title }}</view
    >
    <view
      class="confirm-line w-1 depth-5"
      :style="{ backgroundColor: themeColor.curBgSecond }"
    ></view>
    <view class="confirm-content p-5 w-1">{{ content }}</view>
    <view class="confirm-confirm w-1">
      <view
        class="flex-center confirm-cancel mb-3 mr-3"
        :style="{ color: themeColor.curBgSecond }"
        @tap="cancel"
        >取消</view
      >
      <view
        class="flex-center confirm-check rounded-5 mb-3 mr-3 depth-5"
        :style="{
          color: themeColor.curTextC,
          backgroundColor: themeColor.curBg,
        }"
        @tap="confirm"
        >确定</view
      >
    </view>
  </view>
</template>

<script>
import { useStore } from "vuex";
import MingModel from "@/components/common/MingConfirm.vue";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "提醒",
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
    content: {
      type: String,
    },
    fatherMethod: {
      type: Function,
    },
  },
  components: {
    MingModel,
  },
  setup(props, { emit }) {
    const store = useStore();
    const cancel = () => {
      console.log("cancel");
      store.commit("scheduleInfo/setIsShow", { isShow: false });
    };

    const confirm = () => {
      emit("fatherMethod");
    };

    return {
      confirm,
      cancel,
    };
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  background-color: #fff;

  .confirm-title {
    height: 70px;
    justify-content: flex-start;
  }

  .confirm-line {
    height: 5px;
  }

  .confirm-content {
    white-space: normal;
  }

  .confirm-confirm {
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;

    .confirm-check {
      height: 40px;
      width: 70px;
    }
  }
}
</style>