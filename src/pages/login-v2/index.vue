<template>
  <div>
    <div style="margin-top: 30px">
      <button @click="setCombineTest(1, 1)">设置本科生 - 教务系统</button>
      <button @click="setCombineTest(2, 2)">设置研究生 - 统一验证</button>
      <button @click="setCombineTest(1, 2)">设置本科生 - 统一验证</button>
      <span>loginType: </span>
      <input type="text" v-model="loginType" @input="handleInputLoginType" />
    </div>
    <div>
      <span>userType: </span>
      <input v-model="userType" @input="handleInputUserType" />
    </div>

    <div>分割线</div>

    <button @click="testLogin">点我登陆</button>

    <div>分割线</div>

    <button @click="getVerV2InTestPage">点我获取验证码</button>
    <div class="vcode-container">
      <image
        class="vcode-image"
        :src="'data:image/png;base64,' + vCodePic"
        v-if="vCodePic"
        @tap="getVerV2InTestPage"
      />
      <input v-model="vCodeValue" class="vcode-input"/>
    </div>
    <button @click="testGetSchedule">点我获取课表</button>
    <button @click="getExam">点我获取成绩</button>
    <button @click="getGrade">点我获取考试</button>
  </div>
</template>

<script>
import { requestSsxV3 } from "@/network/ssxRequest/request.js";
import { ref } from "vue";
import * as LOGIN_ENUM from "@/modules/login/enum";
import useLogin from "@/hooks/loginHooks/useLogin.js";
import useUserData from "@/hooks/userDataHooks/useUserData.js";
// 研究生部分
import {
  graduteEncoding,
  logOutInit,
  getStorageSync,
  setStorageSync,
  filterSchedule,
  handleSchedule,
} from "@/utils/common.js";

export default {
  setup() {
    const {
      login,
      getCurrentLoginType,
      getCurrentUserType,
      combineLoginTypeAction,
      separateLoginTypeAction,
    } = useLogin();

    const { getSchedule, getExam, getGrade, getVerV2 } = useUserData();

    const loginType = ref(getStorageSync("loginType"));
    const userType = ref(getStorageSync("userType"));

    const vCodePic = ref('')
    const vCodeValue = ref('')


    const handleInputLoginType = (e) => {
      loginType.value = Number(e.target.value);
      uni.setStorageSync("loginType", loginType.value);
    };

    const handleInputUserType = (e) => {
      userType.value = Number(e.target.value);
      uni.setStorageSync("userType", userType.value);
    };

    const setCombineTest = (userType, loginType) => {
      uni.setStorageSync("userType", userType);
      uni.setStorageSync("loginType", loginType);
    };

    

    const getVerV2InTestPage = async () => {
      const [isError, res] = await getVerV2();

      if (isError) {
        console.log("isError");

        return;
      }

      const { jsessionId, verCode } = res.data;

      if(verCode) {
        vCodePic.value = verCode
      }
    };

    const testGetSchedule = async () => {
      const [isError, res] = await getSchedule()
    } 

    return {
      loginType,
      userType,
      handleInputLoginType,
      handleInputUserType,
      testLogin,
      setCombineTest,
      getSchedule,
      getExam,
      getGrade,
      getVerV2InTestPage,
      vCodePic,
      vCodeValue
    };
  },
};
</script>

<style scoped lang="scss">
.vcode-container {
  display: flex;
  height: 50px;

  .vcode-image {
    height: 100%;
    width: 80px;
    border-right: 1px solid #ccc;
  }

  .vcode-input {
    height: 100%;
    flex: 1;
  }
}

</style>