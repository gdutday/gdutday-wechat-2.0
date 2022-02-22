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
                @tap="sendInfo"
                value="提交我的请求"
                :themeColor="getThemeColor"
              >
              </watch-button>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
    <ming-modal @close="close" :isShow="isShow">
      <template v-slot:default>
        <ming-confirm
          :showedScheduleInfo="showedScheduleInfo"
          :themeColor="getThemeColor"
          content="是否确认提交？"
          @fatherMethod="_postFeedbackInfo()"
        ></ming-confirm>
      </template>
    </ming-modal>
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
import WatchButton from "@/components/common/WatchButton";
import { postFeedbackInfo } from "@/network/ssxRequest/ssxInfo/my.js";
import { getStorageSync, debounce } from "@/utils/common";
export default {
  components: {
    Ztl,
    MingContainer,
    WatchInput,
    WatchButton,
    MingConfirm,
    MingModal,
  },
  setup(props) {
    const store = useStore();
    let feedback = reactive({
      title: "",
      content: "",
      stuId: getStorageSync("stuId"),
    });
    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    //遮罩层是否在显示
    let isShow = computed(() => {
      return store.state.scheduleInfo.isShow;
    });

    const close = () => {
      store.commit("scheduleInfo/setIsShow", { isShow: false });
    };
    //let themeColor = reactive(getThemeColor.value);
    provide("themeColor", getThemeColor.value);

    let warning = ref("你想说啥就说啥，有问还就那个必答");

    const _postFeedbackInfo = () => {
      close();
      return postFeedbackInfo(feedback)
        .then((res) => {
          console.log(res);
          uni.hideLoading();
          uni.showToast({
            title: "发送建议成功",
            duration: 2000,
          });
          close();
        })
        .catch((err) => {
          console.log(err);
          warning.value = err.message;
          uni.showToast({
            title: "发送建议失败",
            duration: 2000,
            icon: "error",
          });
        });
    };

    let sendInfo = () => {
      store.commit("scheduleInfo/setIsShow", { isShow: true });
    };

    return {
      ...toRefs(feedback),
      _postFeedbackInfo,
      warning,
      sendInfo,
      getThemeColor,
      isShow,
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>