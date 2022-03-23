<template>
  <view
    class="login-father w-1 h-1 position-absolute"
    :style="{ backgroundColor: getThemeColor.curBg, height: '1000px' }"
  >
    <ming-toast
      :isShow="toastIsShow"
      @resumeToastIsShow="resumeToastIsShow"
      :content="warningInfo"
      :toastType="toastType"
      :themeColor="getThemeColor"
    ></ming-toast>
    <view
      class="login position-absolute rounded-5 depth-10 w-1 p-2"
      :style="{ top: '530px' }"
    >
      <view class="login-title w-1 my-3">
        <view class="login-title-pic w-1">
          <image
            src="@/static/newLogo.png"
            alt=""
            :style="{ maxWidth: '100px', maxHeight: '100px' }"
          />
        </view>
        <view class="my-2 w-1">
          <view class="login-title-name web-font fw-05 flex-center"
            >GDUTDays</view
          >

          <view class="text-dark flex-center">-- 教务系统登录 --</view>
        </view>
      </view>
      <view class="login-table w-1">
        <view class="w-1 login-input">
          <watch-input
            type="text"
            class=""
            title="学号"
            v-model="stuId"
            placeholder="请输入学号"
            :themeColor="getThemeColor"
          />
        </view>
        <view class="w-1 login-input">
          <watch-input
            type="text"
            class=""
            v-model="pass"
            isPsw="true"
            title="密码"
            placeholder="请输入密码"
            :themeColor="getThemeColor"
          />
        </view>
        <view class="w-1 login-input login-input-yzm">
          <view class="span-12 h-1">
            <watch-input
              type="text"
              class=""
              v-model="vCode"
              title="验证码"
              placeholder="请输入验证码"
              :themeColor="getThemeColor"
            />
          </view>
          <view class="span-6 h-1">
            <image
              class="vcode-image h-1 w-1"
              :src="'data:image/png;base64,' + vCodePic"
              v-if="vCodePic"
              alt=""
              @tap="changeVcodePic"
            />
            <view
              class="vcode-image h-1 w-1 flex-center flex opacity-3"
              @tap="changeVcodePic"
              v-else
            >
              <text>get验证码</text>
            </view>
          </view>
        </view>
      </view>
      <view
        class="warning w-1 mb-4 login-content-warning"
        :class="[warningStatesChange ? '' : 'animation-shake']"
        :style="{
          marginTop: '35px',
          color: warningStatesChange
            ? getThemeColor.curBgSecond
            : getThemeColor.curWarnColor,
        }"
      >
        <text
          class="iconfont mr-1"
          :class="[
            warningStatesChange ? 'icon-icon-test44' : 'icon-icon-test30',
          ]"
        >
        </text>
        {{ warningInfo }}</view
      >
      <view class="watch-button w-1 my-2">
        <watch-button
          value="登录"
          :themeColor="getThemeColor"
          @tap="login"
        ></watch-button>
      </view>
      <view class="login-warning w-1 my-3 flex-center">
        登录即默认您同意我们的用户服务条款
      </view>
      <view
        class="login-jump w-1"
        :style="{ borderTop: `3px solid ${getThemeColor.curBgSecond}` }"
      >
        <view
          v-for="(item, index) of loginQus"
          class="login-jump-child mx-1 py-1 text-dark"
          :key="index"
          @tap="jump(index)"
          ><text class="iconfont icon-icon-test38 mr-1"></text>{{ item }}</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import { useToast } from "@/hooks/index.js";
import { computed, onMounted, reactive, toRefs, watch, ref } from "vue";
import { useStore } from "vuex";
import MingToast from "@/components/common/MingToast.vue";
import WatchInput from "@/components/common/WatchInput.vue";
import WatchButton from "@/components/common/WatchButton.vue";

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
    WatchInput,
    WatchButton,
    MingToast,
  },
  setup() {
    const store = useStore();

    //使用toast需要这部分变量和函数
    //************************************* */
    const { toastType, toastIsShow, resumeToastIsShow, inspireToastIsShow } =
      useToast();
    //************************************* */

    const warningStatesChange = ref(true);
    const checkInput = () => {
      if (
        studentInfo.stuId == "" ||
        studentInfo.pass == "" ||
        studentInfo.vCode == ""
      )
        return "请不要留白";
      else if (studentInfo.stuId.length != 10 || studentInfo.pass.length < 6)
        return "输入长度出错，学号长10位，密码大于6位";
      else if (studentInfo.vCode.length < 4) return "验证码为4位";
      else return 0;
    };

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    let studentInfo = reactive({
      stuId: "",
      pass: "",
      vCode: "",
      jSessionId: "",
      vCodePic: "",
      warningInfo: "欢迎来到gdutday",
    });

    const loginQus = ["用户服务条款", "关于我们", "登录遇到问题"];
    const loginQusRouter = ["My/MyPrivacy", "My/MyAbout", "My/MyCommonProblem"];

    const jump = (index) => {
      uni.navigateTo({
        url: loginQusRouter[index],
      });
    };

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
          console.log(getStorageSync("jSessionId"));
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
          uni.showToast({
            title: "收获考试成功",
            duration: 2000,
          });
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
          uni.showToast({
            title: "收获成绩成功",
            duration: 2000,
          });
          uni.setStorageSync("exam", exam);
          store.commit("exam/setExam", { exam: exam });
          store.commit("exam/setCurrentExam", { termIndex: [0, 0, 0] });
          store.commit("exam/setGPAOfSix");
        })
        .catch((err) => {
          console.log(err);
          uni.showToast({
            title: "收获成绩寄寄",
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
            store.state.scheduleInfo.currentSwiperIndex
          );
          //此时登陆成功
          //从服务端获取的数据被拿去存储到
          uni.hideLoading();
          uni.showToast({
            title: "获取课表成功",
            duration: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
          console.log("err");
          uni.hideLoading();
        });
    };

    const login = throttle(() => {
      let password = encoding(studentInfo.pass, studentInfo.vCode);
      let params = {
        stuId: studentInfo.stuId,
        pass: password,
        vCode: studentInfo.vCode,
        jSessionId: studentInfo.jSessionId,
      };

      let checkIsValue = checkInput();
      if (checkIsValue) {
        inspireToastIsShow();
        studentInfo.warningInfo = checkIsValue;
        toastType.value = "warning";
        return;
      }

      uni.showLoading({ title: "正在登陆中" });
      stuLogin(params)
        .then((res) => {
          uni.hideLoading();
          uni.setStorageSync("campus", res.data);
          uni.setStorageSync("pass", studentInfo.pass);
          uni.setStorageSync("stuId", studentInfo.stuId);

          _getScheduleInfo();
          _getFutureExamInfo();
          _getPastExamAPIExamInfo();
          inspireToastIsShow();
          studentInfo.warningInfo = "登录成功";
          toastType.value = "success";
          store.commit("common/setIsLogin", { isLogin: true });
        })
        .catch((err) => {
          uni.hideLoading();
          console.log(err.message);
          studentInfo.warningInfo = err.message;
          console.log(studentInfo.warningInfo);
          //studentInfo.vCode = "";
          _getVcodeTwice();
          inspireToastIsShow();
          toastType.value = "warning";
        });
    }, 500);

    const changeVcodePic = throttle(_getVcodeTwice, 250);

    onMounted(() => {
      _getVcodeAndSession();
    });

    watch(
      //如果监听reactive里面的数据，那么需要用函数来返回这个变量
      () => studentInfo.warningInfo,
      () => {
        warningStatesChange.value = false;
      }
    );

    return {
      ...toRefs(studentInfo),
      login,
      _getVcodeTwice,
      changeVcodePic,
      loginQus,
      jump,
      getThemeColor,
      loginQus,
      warningStatesChange,
      //下面要用于toast
      toastIsShow,
      toastType,
      resumeToastIsShow,
    };
  },
};
</script>


<style lang="scss" scoped>
.login-father {
  min-height: 100vh;
}
.login {
  display: flex;
  top: 20px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  max-width: 400px;
  height: 880px;
  background-color: rgba(255, 255, 255, 0.788);

  .login-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .login-title-name {
      font-size: 2rem;
    }

    .login-title-pic {
      height: 100px;
      width: 100px;
    }
  }

  .login-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 250px;
  }

  .login-input {
    height: 60px;
  }

  .login-input-yzm {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    .vcode-image {
      margin-top: 10px;
      background: #fff;
    }
  }

  .watch-button {
    height: 60px;
  }

  .login-warning {
    font-weight: 800;
  }

  .login-jump {
    display: flex;
    width: 150px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #ccc;

    .login-jump-child {
      width: 120px;
    }
  }
}
</style>



    //此处执行登录
    // const requestLogin = (params) => {
    //   return new Promise(async (resolve, reject) => {
    //     await stuLogin(params)
    //       .then((res) => {
    //         resolve("登陆成功");
    //       })
    //       .catch((err) => {
    //         console.log("--------------");
    //         console.log(555);
    //         console.log(err);
    //         reject("登录失败");
    //         console.log("--------------");
    //         console.log(err);
    //         uni.hideLoading();
    //         console.log(err.message);
    //         studentInfo.warningInfo = err.message;
    //         console.log(studentInfo.warningInfo);
    //         studentInfo.vCode = "";
    //         _getVcodeTwice();
    //       });
    //   });
    // };

    // //此处执行登录后数据的获取
    // const requestUserInfo = (params) => {
    //   return new Promise(async (resolve, reject) => {
    //     await _getScheduleInfo();
    //     await _getFutureExamInfo();
    //     await _getPastExamAPIExamInfo();
    //   });
    // };

    // const handleLogin = async (params) => {
    //   try {
    //     let res = await requestLogin(params);
    //     console.log(res);
    //     let shit = await requestUserInfo(res);
    //     return shit;
    //   } catch (err) {
    //     return err;
    //   }
    // };

    // const login = throttle(() => {
    //   let password = encoding(studentInfo.pass, studentInfo.vCode);
    //   let params = {
    //     stuId: studentInfo.stuId,
    //     pass: password,
    //     vCode: studentInfo.vCode,
    //     jSessionId: studentInfo.jSessionId,
    //   };
    //   uni.setStorageSync("pass", studentInfo.pass);
    //   uni.setStorageSync("stuId", studentInfo.stuId);
    //   uni.showLoading({ title: "正在登陆中" });

    //   handleLogin(params)
    //     .then((info) => {
    //       console.log("handle login success" + info);
    //     })
    //     .catch((err) => {
    //       console.log("handle login gg" + err);
    //       uni.hideLoading();
    //       console.log(err.message);
    //       studentInfo.warningInfo = err.message;
    //       console.log(studentInfo.warningInfo);
    //       studentInfo.vCode = "";
    //       _getVcodeTwice();
    //     });
    // }, 300);