<template>
  <view class="h-1 login">
    <Ztl class="ztl">
      <template v-slot:navName>
        <div>登录</div>
      </template>
    </Ztl>
    <!-- 上方是登陆nav框 -->
    <view class="loginarea w-1 flex-center">
      <view class="login-content flex-center">
        <view class="login-content-logo flex-center">
          <image src="@/static/newLogo.png" alt="" />
        </view>
        <view class="login-content-desc flex-center">
          <text>教务系统登录</text>
        </view>
        <view class="login-content-input">
          <text>学号</text>
          <input type="text" v-model="stuId" />
        </view>
        <view class="login-content-input">
          <text>密码</text>
          <input type="text" v-model="pass" />
        </view>
        <view class="login-content-input">
          <text>验证码</text>
          <view class="login-content-input-yzm">
            <input type="text" v-model="vCode" />
            <image
              :src="'data:image/png;base64,' + vCodePic"
              alt=""
              @tap="getVcodeTwice"
            />
          </view>
        </view>
        <view class="login-content-warning flex-center text-warning">
          <text>{{ warningInfo }}</text>
        </view>
        <view class="login-content-button flex-center" @tap="login">
          登录
        </view>
        <view class="login-content-about">
          <text class="flex-center text-gray"
            >登录即默认您同意我们的用户服务条款</text
          >
          <view class="login-content-about-info">
            <view>用户服务条款</view>
            <view>关于我们</view>
            <view>登录遇到问题</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
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
} from "@/utils/common.js";
import CryptoJS from "./crypto-js";
export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore();
    let studentInfo = reactive({
      stuId: "3120006196",
      pass: "Hh5201123.",
      vCode: "",
      jSessionId: "",
      vCodePic: "",
      warningInfo: "欢迎来到gdutday",
    });

    function encoding(pass, vCode) {
      var verifycode = vCode;
      var password = pass;
      var key = CryptoJS.enc.Utf8.parse(
        verifycode + verifycode + verifycode + verifycode
      );
      var srcs = CryptoJS.enc.Utf8.parse(password);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      var pw = encrypted.ciphertext.toString();
      return pw;
    }

    const getVcodeTwice = () => {
      getVcodeAndSession(getStorageSync("jSessionId"))
        .then((res) => {
          let result = res.data;
          studentInfo.vCodePic = result.vCodePic;
          if (res.data.data.jSessionId) {
            studentInfo.jSessionId = result.jSessionId;
            uni.setStorageSync("jSessionId", result.jSessionId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    onMounted(() => {
      getVcodeAndSession()
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
    });

    const login = () => {
      let password = encoding(studentInfo.pass, studentInfo.vCode);
      let params = {
        stuId: studentInfo.stuId,
        pass: password,
        vCode: studentInfo.vCode,
        jSessionId: studentInfo.jSessionId,
      };
      uni.showLoading({ title: "正在登陆中" });
      stuLogin(params)
        .then((res) => {
          getScheduleInfo(getStorageSync("jSessionId"))
            .then((res, req) => {
              let obj = filterSchedule(res.data);
              let weeksData = obj.weeksData;
              let scheduleIdColor = obj.scheduleIdColor;

              console.log(scheduleIdColor);
              uni.setStorageSync("weeksData", weeksData);
              uni.setStorageSync("scheduleIdColor", scheduleIdColor);

              handleSchedule(weeksData, getStorageSync("currentWeek"));
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
              //getVcodeTwice();
              // uni.showToast({
              //   title: "收获课表寄寄",
              //   duration: 2000,
              //   icon: "error",
              // });
            });

          getFutureExamInfo(getStorageSync("jSessionId"))
            .then((res, req) => {
              let futureExam = res.data;
              uni.setStorageSync("futureExam", futureExam);
            })
            .catch((err) => {
              console.log(err);
              uni.showToast({
                title: "收获考试寄寄",
                duration: 2000,
                icon: "error",
              });
            });

          getPastExamAPIExamInfo(getStorageSync("jSessionId"))
            .then((res, req) => {
              let exam = res.data;
              uni.setStorageSync("exam", exam);
            })
            .catch((err) => {
              console.log(err);
              uni.showToast({
                title: "收获考试寄寄",
                duration: 2000,
                icon: "error",
              });
            });
        })
        .catch((err) => {
          console.log(err.message);
          studentInfo.warningInfo = err.message;
          console.log(studentInfo.warningInfo);
          getVcodeTwice();
        });
    };

    return {
      ...toRefs(studentInfo),
      login,
      getVcodeTwice,
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

    .login-content {
      width: 80%;
      height: 80%;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #222227;

      input {
        border-bottom: 1px solid #000;
        height: 60rpx;
        padding: 10px;
      }

      .login-content-logo {
        image {
          width: 100px;
          height: 100px;
        }
      }

      .login-content-warning {
        margin-bottom: 0;
      }

      .login-content-input {
        .login-content-input-yzm {
          width: 100%;
          height: 100%;

          input {
            float: left;
            width: 60%;
          }

          image {
            float: right;
            height: 60%;
            width: 40%;
          }
        }
      }
      .login-content-about-info {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 5px;
      }

      .login-content-button {
        height: 40px;
        background: pink;
      }
    }

    .login-content > view {
      width: 80%;
      margin-bottom: 20px;
    }
  }
}
</style>