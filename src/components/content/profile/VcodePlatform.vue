<template>
  <view class="vp">
    <view class="vp-container w-1 h-1 p-3">
      <view
        class="vp-title w-1 flex-center"
        :style="{ borderBottom: `${getThemeColor} 3px solid` }"
      >
        请输入验证码
      </view>
      <view class="vp-image pt-3">
        <image
          :src="'data:image/png;base64,' + vCodePic"
          mode=""
          class="h-1 w-1"
          @tap="_getVcodeTwice"
        />
      </view>
      <view class="vp-input w-1 mt-3">
        <watch-input v-model="vCode" placeholder="Vcode" />
      </view>
      <view class="vp-button w-1 pt-3">
        <watch-button
          class="w-1 h-1 flex-center small-title-font"
          value="确定"
          @tap="login"
        ></watch-button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import WatchInput from "@/components/common/WatchInput.vue";
import WatchButton from "@/components/common/WatchButton";
import { getStorageSync, encoding } from "@/utils/common";
import {
  getVcodeAndSession,
  stuLogin,
} from "@/network/ssxRequest/ssxInfo/scheduleInfo.js";
export default {
  components: {
    WatchInput,
    WatchButton,
  },
  setup(props, { emit }) {
    const store = useStore();
    //登录接口
    let studentInfo = reactive({
      stuId: getStorageSync("stuId"),
      pass: getStorageSync("pass"),
      vCode: "",
      jSessionId: getStorageSync("jSessionId"),
      vCodePic: "",
    });
    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });
    const _getVcodeTwice = () => {
      return getVcodeAndSession(getStorageSync("jSessionId"))
        .then((res) => {
          let result = res.data;
          studentInfo.vCodePic = result.vCodePic;
          if (res.data.jSessionId) {
            studentInfo.jSessionId = result.jSessionId;
            uni.setStorageSync("jSessionId", result.jSessionId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const login = () => {
      let password = encoding(studentInfo.pass, studentInfo.vCode);
      let params = {
        stuId: studentInfo.stuId,
        pass: password,
        vCode: studentInfo.vCode,
        jSessionId: studentInfo.jSessionId,
      };
      uni.showLoading({ title: "正在登陆中" });
      console.log(props);
      stuLogin(params)
        .then((res) => {
          store.commit("common/setKeyValue");
          store.commit("scheduleInfo/setIsShow", { isShow: false });
          uni.hideLoading();
          uni.setStorageSync("jSessionId", studentInfo.jSessionId);
          emit("afterRefresh"); //在此处调用负组件中的方法
          uni.showToast({
            title: "验证码正确",
            duration: 2000,
          });
        })
        .catch((err) => {
          console.log(err.message);
          // studentInfo.warningInfo = err.message;
          //console.log(studentInfo.warningInfo);
          console.log("--------");
          console.log(err);
          uni.showToast({
            title: "验证码错误",
            duration: 2000,
            icon: "error",
          });
          console.log("------");
          _getVcodeTwice();
        });
    };

    onMounted(() => {
      _getVcodeTwice();
    });

    return {
      login,
      ...toRefs(studentInfo),
      getThemeColor,
      _getVcodeTwice,
    };
  },
};
</script>

<style lang="scss" scoped>
.vp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-width: 350px;
  padding: 35px;
  border-radius: 25rpx;

  .vp-container {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    justify-content: space-around;
    align-items: center;
    border-radius: 20rpx;

    .vp-title {
      height: 40px;
    }

    .vp-image {
      width: 100px;
      height: 70px;
    }

    .vp-input {
      height: 40px;
    }
    .vp-button {
      height: 70px;
    }
  }
}
</style>