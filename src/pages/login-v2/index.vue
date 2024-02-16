<template>
  <view class="position-relative">
    <Ztl>
      <template v-slot:navName>
        <view>登陆</view>
      </template>
    </Ztl>
    <div class='login'>

    </div>
    <div class="w-1 px-3">
      <button @click="setCombineTest(1, 1)">设置本科生 - 教务系统</button>
      <button @click="setCombineTest(2, 2)">设置研究生 - 统一验证</button>
      <button @click="setCombineTest(1, 2)">设置本科生 - 统一验证</button>
    </div>
    <div>
    </div>

    <div>分割线</div>

    <button @click="testLogin">点我登陆</button>

    <div>分割线</div>
    <button @click='testGetTermId'>点我获取学期</button>

    <button @click="getVerV2InTestPage">点我获取验证码</button>
    <div class="vcode-container">
      <image class="vcode-image" :src="'data:image/png;base64,' + vCodePic" v-if="vCodePic" @tap="getVerV2InTestPage" />
      <input v-model="vCodeValue" class="vcode-input" />
    </div>
    <button @click="testGetSchedule">点我获取课表</button>
    <button @click="testGetGrade">点我获取成绩</button>
    <button @click="testGetExam">点我获取考试</button>
  </view>
</template>

<script>
import {requestSsxV3} from "@/network/ssxRequest/request.js";
import {ref} from "vue";
import * as LOGIN_ENUM from "@/modules/login/enum";
import useLogin from "@/hooks/loginHooks/useLogin.js";
import useUserData from "@/hooks/userDataHooks/useUserData.js";
import Ztl from "@/components/common/Ztl.vue";

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
  components: {
    Ztl
  },
  setup() {
    const {
      login,
      getCurrentLoginType,
      getCurrentUserType,
      combineLoginTypeAction,
      separateLoginTypeAction,
    } = useLogin();

    const {getSchedule, getExam, getGrade, getVerV2, getTermIdV2} = useUserData();

    const loginType = ref(getStorageSync("loginType"));
    const userType = ref(getStorageSync("userType"));

    const vCodePic = ref('')
    const vCodeValue = ref('')

    const goBack = () => {
      uni.switchTab({
        url: '/pages/profile/Profile',
      })
    }
    const setCombineTest = (userTypeParam, loginTypeParam) => {
      uni.setStorageSync("userType", userTypeParam);
      uni.setStorageSync("loginType", loginTypeParam);
      userType.value = userTypeParam;
      loginType.value = loginTypeParam;

    };

    const testLogin = async () => {
      const combineLoginType = combineLoginTypeAction(
        getCurrentUserType(),
        getCurrentLoginType()
      );

      let params = {}
      switch (combineLoginType) {
        case LOGIN_ENUM.UG_V1: {
          params = {
            ...params,
            user: username.value,
            password: password.value,
            code: vCodeValue.value,
            jSessionId: getStorageSync('jsessionId')
          }
          break;
        }
        case LOGIN_ENUM.PG_V2: {
          params = {
            ...params,
            user: username.value,
            password: password.value,
          }
          break;
        }
        case LOGIN_ENUM.UG_V2: {
          params = {
            ...params,
            user: username.value,
            password: password.value,
          }
          break;
        }
        default: {
          console.log("error", "请求userType或者loginType不符合规范");
        }
      }

      const result = await login(params)

      // 登陆成功的callback
      Promise.all(getSchedule, getExam, getGrade).then((res) => {
        console.log('res tesswt', res);
      })
    };

    const getVerV2InTestPage = async () => {
      const [isError, res] = await getVerV2();

      if (isError) {
        console.log("isError");

        return;
      }

      const {jsessionId, verCode} = res.data;

      if (verCode) {
        vCodePic.value = verCode
      }
    };

    const testGetSchedule = async () => {
      const res = await getSchedule()
    }

    const testGetExam = async () => {
      const res = await getExam()
    }

    const testGetGrade = async () => {
      const res = await getGrade()
    }

    const testGetTermId = async () => {
      const res = await getTermIdV2()
    }



    return {
      goBack,
      loginType,
      userType,
      testLogin,
      setCombineTest,
      testGetSchedule,
      getExam,
      getGrade,
      getVerV2InTestPage,
      vCodePic,
      vCodeValue,
      testGetGrade,
      testGetExam,
      testGetTermId
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