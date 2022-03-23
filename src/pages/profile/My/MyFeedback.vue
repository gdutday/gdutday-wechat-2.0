<template>
  <view class="position-relative">
    <Ztl>
      <template v-slot:navName>
        <view>我要反馈意见！</view>
      </template>
      <ming-container> </ming-container>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>我要投诉！</text> </template>
        <template v-slot:desc>
          <text
            >在这里可以对gdutday提出你自己的建议噢，我们一定会看完仔细分析，争取将它做进未来的小寄里面！</text
          >
        </template>
        <template v-slot:default>
          <view class="w-1">
            <view :style="{ width: '100%', height: '40px' }">
              <watch-input
                v-model="title"
                placeholder="标题"
                :themeColor="getThemeColor"
              />
            </view>
            <view :style="{ width: '100%', height: '150px' }" class="mt-5">
              <watch-input
                textarea
                v-model="content"
                :themeColor="getThemeColor"
                placeholder="请写出你对我们寄递右剃兔的小小的建议"
              />
            </view>
            <view class="w-1 flex-center my-3 text-warning">{{ warning }}</view>
            <view class="w-1 mt-5" :style="{ height: '60px' }">
              <watch-button
                @tap="openModal"
                value="提交我的请求"
                :themeColor="getThemeColor"
              >
              </watch-button>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
    <ming-confirm
      :showedScheduleInfo="showedScheduleInfo"
      :themeColor="getThemeColor"
      content="是否确认提交？"
      @fatherMethod="_postFeedbackInfo()"
    ></ming-confirm>
    <ming-toast
      :isShow="toastIsShow"
      @resumeToastIsShow="resumeToastIsShow"
      :content="warning"
      :toastType="toastType"
      :themeColor="getThemeColor"
    ></ming-toast>
  </view>
</template>

<script>
import { toRefs, reactive, ref, computed, provide } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import WatchInput from "@/components/common/WatchInput";
import MingConfirm from "@/components/common/MingConfirm";
import MingModal from "@/components/common/MingModal";
import MingToast from "@/components/common/MingToast";
import WatchButton from "@/components/common/WatchButton";
import { postFeedbackInfo } from "@/network/ssxRequest/ssxInfo/my.js";
import { getStorageSync, debounce } from "@/utils/common";
import { useToast, useMingModal } from "@/hooks/index.js";
export default {
  components: {
    Ztl,
    MingContainer,
    WatchInput,
    WatchButton,
    MingConfirm,
    MingModal,
    MingToast,
  },
  setup(props) {
    const store = useStore();

    let feedback = reactive({
      title: "",
      content: "",
      stuId: getStorageSync("stuId"),
    });

    //使用toast需要这部分变量和函数
    //************************************* */
    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } =
      useToast();
    let warning = ref("你想说啥就说啥，有问还就那个必答");
    //************************************* */
    const { isShow, close, openModal } = useMingModal();

    const getThemeColor = computed(() => store.state.theme);

    const _postFeedbackInfo = () => {
      //uni.hideLoading();
      close();
      inspireToastIsShow();
      return postFeedbackInfo(feedback)
        .then(() => {
          toastType.value = "success";
          warning.value = "发送建议成功";
        })
        .catch((err) => {
          warning.value = err.message;
          toastType.value = "warning";
        });
    };

    return {
      ...toRefs(feedback),
      _postFeedbackInfo,
      warning,
      openModal,
      getThemeColor,
      isShow,
      close,
      toastIsShow,
      toastType,
      resumeToastIsShow,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>