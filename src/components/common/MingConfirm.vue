<template>
  <ming-modal @close="close" :isShow="isShow">
    <view class="confirm position-absolute w-1 rounded-4 overflow-hidden depth-5"
      :style="{border: `1px solid ${themeColor.curBgSecond}`}">
      <!-- header部分 -->
      <view class="confirm-title flex-center title-font w-1 p-5 depth-2 web-font" :style="{
        color: themeColor.curTextC,
        backgroundColor: themeColor.curBg,
      }">{{ title }}</view>
      <view class="confirm-line w-1 depth-5" :style="{backgroundColor: themeColor.curBgSecond}"></view>
      <view class="confirm-content p-5 w-1">
        <view v-if="content" class="text-dark mb-1">{{ content }}</view>
        <scroll-view class="scroll-view my-scroll-view w-1 h-1" scroll-y scroll-with-animation>
          <slot name="default"></slot>
        </scroll-view>
      </view>

      <!-- 确认部分 -->
      <view class="confirm-confirm w-1">
        <view class="flex-center confirm-check rounded-5 mb-3" :style="{
          color: themeColor.curBgSecond,
        }" @tap="close">取消</view>
        <slot name='confirm'>
          <watch-button class="flex-center confirm-check rounded-5 mb-3 mr-3" :themeColor="themeColor" @tap="confirm"
            value="确认">
          </watch-button>
        </slot>
      </view>
    </view>
  </ming-modal>
</template>

<script>
import {useStore} from "vuex";
import WatchButton from "@/components/common/WatchButton.vue";
import MingModal from "@/components/common/MingModal";
import {useMingModal} from "@/hooks/index.js";
export default {
  components: {
    WatchButton,
    MingModal,
  },
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
      default: () => { },
    },
    content: {
      type: String,
    },
    fatherMethod: {
      type: Function,
    },
  },
  setup(props, {emit}) {
    const {isShow, close} = useMingModal();

    const confirm = () => {
      emit("fatherMethod");
    };

    return {
      confirm,
      isShow,
      close,
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

.my-scroll-view {
  max-height: 200px;
}
</style>