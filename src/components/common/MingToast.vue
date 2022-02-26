<template>
  <view
    class="toast transition-2 opacity-9 py-4 px-3 rounded-2 depth-ming"
    :style="{
      zIndex: 999,
      top: toastIsShow ? '35px' : '-500px',
    }"
  >
    <view
      class="toast-title"
      :style="{
        color: toastType == 'success' ? '#1B5E20' : themeColor.curWarnColor,
      }"
      ><h2 class="small-title-font fw-2">
        {{ buildToastTitle(toastType) }}
      </h2></view
    >
    <view class="mt-2">{{ content }}</view>
  </view>
</template>

<script>
import { ref, computed, watch, toRefs } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    toastType: {
      type: String,
      default: "success",
    },
    content: {
      type: String,
      default: "这里是toast里的内容",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const store = useStore();

    //这里用于进行中文英文转换
    // ***************************************
    const toastTypeEnglish = ["success", "warning"];
    const toastTypeChinese = ["成功", "警告"];
    const buildToastTitle = (type) => {
      return toastTypeChinese[
        toastTypeEnglish.findIndex((item) => item == type)
      ];
    };
    // ***************************************
    const toastIsShow = computed(() => {
      return store.state.common.toastIsShow;
    });

    watch(
      () => props.isShow,
      () => {
        console.log("我在toast调用函数");
        if (props.isShow) {
          setTimeout(() => {
            //在1.5秒后重新将这个隐藏
            store.commit("common/setToastIsShow", {
              toastIsShow: false,
            });
            emit("resumeToastIsShow");
          }, 1500);
          //让它显示1.5s
          store.commit("common/setToastIsShow", {
            toastIsShow: true,
          });
          //并把props里的isShow改为原本的false状态
        }
      }
    );

    return { toastIsShow, buildToastTitle };
  },
};
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;

  .toast-title {
    height: 30px;
  }
}
</style>