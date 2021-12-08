<template>
  <view class="h-1 login">
    <Ztl class="ztl">
      <template v-slot:navBack>
        <div>{{}}</div>
      </template>
      <template v-slot:navName>
        <div>登录</div>
      </template>
    </Ztl>
    <!-- 上方是登陆nav框 -->
    <view class="loginarea w-1 flex-center animation-huarotate">
      <view class="h-1 w-1 login-content flex-center">
        <view class="w-1 login-content-logo flex-center mb-4">
          <image src="@/static/newLogo.png" alt="" class="logo-image mr-2" />
          <view class="title-font logo-text">
            <text class="logo-text-head">G</text>
            <view class="other">
              <text class="logo-text-method text-dark">教务系统登录</text>
              <text class="logo-text-body">dutday</text>
            </view>
          </view>
        </view>
        <view class="w-1 login-input-area">
          <view class="login-content-input pb-2">
            <text class="pt-2 small-title-font">Student ID</text>
            <!-- <input
              type="text"
              v-model="stuId"
              class="input-ming login-content-input-input"
            /> -->
            <watch-input
              v-model="stuId"
              placeholder="student ID"
              :style="{ width: '100%', height: '70rpx' }"
            />
          </view>
          <view class="login-content-input pb-2">
            <text class="pt-2 small-title-font">Password</text>
            <watch-input
              v-model="pass"
              type="password"
              placeholder="password"
              class="login-content-input-password"
              :style="{ width: '100%', height: '70rpx' }"
            />
            <text class=""></text>
          </view>
          <view class="login-content-input pb-2">
            <text class="pt-2 small-title-font">Vcode</text>
            <view class="login-content-input-yzm w-1">
              <watch-input
                v-model="vCode"
                :style="{ width: '60%', height: '70rpx' }"
                placeholder="Vcode"
              />
              <image
                class="vcode-image"
                :src="'data:image/png;base64,' + vCodePic"
                alt=""
                @tap="changeVcodePic"
                :style="{ width: '35%', height: '70rpx' }"
              />
            </view>
          </view>
        </view>
        <view class="w-1 login-content-warning flex-center text-danger my-2">
          <text>{{ warningInfo }}</text>
        </view>
        <view class="w-1 login-content-button flex-center" @tap="login">
          <watch-button
            class="w-1 h-1 flex-center small-title-font"
            value="登录"
          ></watch-button>
        </view>
        <view class="login-content-about mt-2">
          <text class="flex-center text-dark about-all"
            >登录即默认您同意我们的用户服务条款</text
          >
          <view class="login-content-about-info mt-2">
            <view class="mx-1">用户服务条款</view>
            <view class="mx-1">关于我们</view>
            <view class="mx-1">登录遇到问题</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import WatchInput from "@/components/common/WatchInput.vue";
import WatchButton from "@/components/common/WatchButton.vue";
import { onMounted, reactive, toRefs } from "vue";
import {
  getVcodeAndSession,
  stuLogin,
  getScheduleInfo,
} from "@/network/ssxRequest/ssxInfo/scheduleInfo.js";
import {
  getFutureExamInfo,
  getPastExamAPIExamInfo,
} from "@/network/ssxRequest/ssxInfo/futureExamInfo.js";
import {
  getStorageSync,
  filterSchedule,
  handleSchedule,
  encoding,
  throttle,
  debounce,
} from "@/utils/common.js";
export default {
  components: {
    Ztl,
    WatchInput,
    WatchButton,
  },
  setup() {
    const store = useStore();
    let studentInfo = reactive({
      stuId: "",
      pass: "",
      vCode: "",
      jSessionId: "",
      vCodePic: "",
      warningInfo: "欢迎来到gdutday",
    });

    const _getVcodeAndSession = () => {
      return getVcodeAndSession()
        .then((res) => {
          let result = res.data;
          studentInfo.jSessionId = result.jSessionId;
          studentInfo.vCodePic = result.vCodePic;
          console.log(studentInfo);
          uni.setStorageSync("jSessionId", result.jSessionId);
        })
        .catch((err) => {
          console.log(err);
        });
    };

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

    const _getFutureExamInfo = () => {
      return getFutureExamInfo(getStorageSync("jSessionId"))
        .then((res, req) => {
          let futureExam = res.data;
          uni.setStorageSync("futureExam", futureExam);
          store.commit("exam/setFutureExam", { futureExam: futureExam });
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: "收获考试寄寄",
            duration: 2000,
            icon: "error",
          });
        });
    };

    const _getPastExamAPIExamInfo = () => {
      return getPastExamAPIExamInfo(getStorageSync("jSessionId"))
        .then((res, req) => {
          let exam = res.data;
          uni.setStorageSync("exam", exam);
          store.commit("exam/setExam", { exam: exam });
          store.commit("exam/setCurrentExam", { termIndex: [0, 0, 0] });
          store.commit("exam/setGPAOfSix");
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: "收获考试寄寄",
            duration: 2000,
            icon: "error",
          });
        });
    };

    const _getScheduleInfo = () => {
      return getScheduleInfo(getStorageSync("jSessionId"))
        .then((res, req) => {
          let obj = filterSchedule(res.data);
          let weeksData = obj.weeksData;
          let scheduleIdColor = obj.scheduleIdColor;
          uni.setStorageSync("weeksData", weeksData);
          uni.setStorageSync("scheduleIdColor", scheduleIdColor);
          handleSchedule(
            weeksData,
            getStorageSync("currentWeek"),
            store.state.scheduleInfo.currentIndex
          );
          //此时登陆成功
          //从服务端获取的数据被拿去存储到
          uni.hideLoading();
          uni.showToast({
            title: "收获课表陈坤",
            duration: 2000,
          });
          store.commit("common/setIsLogin", { isLogin: true });
        })
        .catch((err) => {
          console.log(err);
          console.log("err");
          uni.hideLoading();
        });
    };

    onMounted(() => {
      _getVcodeAndSession();
    });

    const login = throttle(() => {
      let password = encoding(studentInfo.pass, studentInfo.vCode);
      let params = {
        stuId: studentInfo.stuId,
        pass: password,
        vCode: studentInfo.vCode,
        jSessionId: studentInfo.jSessionId,
      };
      uni.setStorageSync("pass", studentInfo.pass);
      uni.setStorageSync("stuId", studentInfo.stuId);
      uni.showLoading({ title: "正在登陆中" });
      stuLogin(params)
        .then((res) => {
          _getScheduleInfo();
          _getFutureExamInfo();
          _getPastExamAPIExamInfo();
          store.commit("common/setKeyValue");
        })
        .catch((err) => {
          console.log(err.message);
          studentInfo.warningInfo = err.message;
          console.log(studentInfo.warningInfo);
          studentInfo.vCode = "";
          _getVcodeTwice();
        });
    }, 300);

    const changeVcodePic = debounce(_getVcodeTwice, 300);

    return {
      ...toRefs(studentInfo),
      login,
      _getVcodeTwice,
      changeVcodePic,
    };
  },
};
</script>


<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;

  .loginarea {
    flex: 1;
    padding: 0 30px;

    .login-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;

      .login-content-logo {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        image {
          width: 150rpx;
          height: 150rpx;
          max-width: 100px;
          max-height: 100px;
        }

        .logo-text {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .logo-text-head {
            font-size: 150rpx;
          }

          .other {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;

            .logo-text-body {
              font-size: 85rpx;
              flex: 1;
            }

            .logo-text-method {
              font-size: 40rpx;
              flex: 1;
            }
          }
        }
      }

      .login-input-area {
        .login-content-input {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .login-content-input-yzm {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
      .login-content-button {
        height: 40px;
      }

      .login-content-about {
        .about-all {
          text-decoration: underline;
        }
        .login-content-about-info {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
      }
    }
  }
}
</style>