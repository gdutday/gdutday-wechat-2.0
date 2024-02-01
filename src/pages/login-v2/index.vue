<template>
  <div>
    <div style="margin-top: 30px">
      <span>loginType: </span>
      <input type="text" v-model="loginType" @input="handleInputLoginType" />
    </div>
    <div>
      <span>userType: </span>
      <input v-model="userType" @input="handleInputUserType" />
    </div>

    <div>分割线</div>

    <button @click="testLogin">点我登陆</button>
  </div>
</template>

<script>
import { requestSsxV3 } from "@/network/ssxRequest/request.js";
import { ref } from "vue";
import * as LOGIN_ENUM from '@/modules/login/enum';
import useLogin from "@/hooks/loginHooks/useLogin.js";
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
    const loginType = ref(1);
    const userType = ref(1);

    const handleInputLoginType = (e) => {
      loginType.value = Number(e.target.value);
      uni.setStorageSync("loginType", loginType.value);
    };

    const handleInputUserType = (e) => {
      userType.value = Number(e.target.value);
      uni.setStorageSync("userType", userType.value);
    };

    const {
      login,
      getCurrentLoginType,
      getCurrentUserType,
      combineLoginTypeAction,
      separateLoginTypeAction,
    } = useLogin();



    return {
      loginType,
      userType,
      handleInputLoginType,
      handleInputUserType,
      testLogin
    };
  },
};
</script>