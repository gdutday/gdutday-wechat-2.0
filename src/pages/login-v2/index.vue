<template>
  <view class="position-relative">
    <Ztl>
      <template v-slot:navName>
        <view>登陆</view>
      </template>
    </Ztl>
    <div class='login'>
      <div class='login-chooser'>
        <div v-for='(loginChooserItem, index) in loginChooserContent' :key='index'
          @tap='onChoose(loginChooserItem.onclick)' class='login-chooser-item' :class='{
            "login-chooser-active": !!loginChooserItem.isActive,
          }'>
          <div class='login-chooser-icon' :class='{
            "login-chooser-ug": loginChooserItem.userType === 1,
            "login-chooser-pg": loginChooserItem.userType === 2,
          }'>{{ loginChooserItem.icon }} </div>
          <div class='login-chooser-content'>{{ loginChooserItem.content }}</div>
          <div class='login-chooser-tag' :class='{
            "login-chooser-tag-jw": loginChooserItem.loginType === 1,
            "login-chooser-tag-ty": loginChooserItem.loginType === 2
          }'>{{ loginChooserItem.loginPath }}</div>
        </div>
      </div>

      <div class='login-form'>
        <view class="w-1 login-input">
          <watch-input type="text" class="" title="学号" v-model="username" placeholder="请输入学号"
            :themeColor="getThemeColor" />
        </view>
        <view class="w-1 login-input">
          <watch-input type="text" class="" v-model="password" isPsw="true" title="密码" placeholder="请输入密码"
            :themeColor="getThemeColor" />
        </view>


        <div class="w-1 login-vcode" v-if='shouldDisplayVCode'>
          <view class="login-input">
            <watch-input type="text" class="" v-model="vCodeValue" isPsw="false" title="验证码" placeholder="请输入验证码"
              :themeColor="getThemeColor" />
          </view>
          <image class="vcode-image" :src="'data:image/png;base64,' + vCodePic" v-if="vCodePic" @tap="getVerV2InPage" />
        </div>
        <div class="login-warning">
          哈哈傻到合适的哈是的哈说
        </div>
      </div>

      <div class="login-button">
        <view class="watch-button w-1 my-2">
          <watch-button value="登录" :themeColor="getThemeColor" @tap="loginAction"></watch-button>
        </view>
      </div>
    </div>
    <!-- <button @click="testLogin">点我登陆</button>
    <button @click='testGetTermId'>点我获取学期</button>

    <button @click="getVerV2InPage">点我获取验证码</button>
    <div class="vcode-container">
      <image class="vcode-image" :src="'data:image/png;base64,' + vCodePic" v-if="vCodePic" @tap="getVerV2InPage" />
      <input v-model="vCodeValue" class="vcode-input" />
    </div>
    <button @click="testGetSchedule">点我获取课表</button>
    <button @click="testGetGrade">点我获取成绩</button>
    <button @click="testGetExam">点我获取考试</button> -->
  </view>
</template>

<script>
import {requestSsxV3} from "@/network/ssxRequest/request.js";
import {ref, computed, watch} from "vue";
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

import useLoginChooser from './hooks/useLoginChooser'
import {useStore} from 'vuex'
import WatchInput from '@/components/common/WatchInput.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import useLoginParams from './hooks/useLoginParams'

export default {
  components: {
    Ztl,
    WatchInput,
    WatchButton
  },
  setup() {
    const store = useStore()
    const {
      login,
      getCurrentLoginType,
      getCurrentUserType,
      combineLoginTypeAction,
      separateLoginTypeAction,
    } = useLogin();

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    const {getSchedule, getExam, getGrade, getVerV2, getTermIdV2} = useUserData();
    const {userType, loginType, loginChooserContent, setChooser} = useLoginChooser()
    const onChoose = (operation) => {
      operation()
    }

    const {
      username,
      password,
      vCodePic,
      vCodeValue,
    } = useLoginParams()

    const shouldDisplayVCode = computed(() => {
      return loginType.value === 1 && userType.value === 1
    })

    const loginAction = async () => {
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

      const [isError, data] = await login(params)

      console.log('[isError, data]', isError, data);

      if (isError) {
        const {code, msg} = data

        // 错误code以及错误消息

        return
      }

      // 登陆成功的callback
      Promise.all([getSchedule(), getExam(), getGrade()]).then((res) => {
        console.log('res tesswt', res);

        uni.navigateBack({
          delta: 1,
        });
      })
    };

    const getVerV2InPage = async () => {
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

    watch(() => loginType.value === 1 && userType.value === 1,
      () => {
        getVerV2InPage()
      }, {
      immediate: true,
    })

    return {
      // 登陆信息
      username,
      password,
      vCodePic,
      vCodeValue,

      // 登陆操作
      loginAction,

      // 获取数据的接口
      getExam,
      getGrade,
      getVerV2InPage,

      // 选择登陆渠道
      loginChooserContent,
      onChoose,

      // 通用store
      getThemeColor,

      // 权限控制
      shouldDisplayVCode
    };
  },
};
</script>

<style scoped lang="scss">
.login {
  .login-chooser {
    display: flex;
    align-items: center;
    flex-direction: column;

    .login-chooser-item {
      padding: 12px 16px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      font-size: 15px;
      transition: .3s all;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      background: transparent;
    }

    .login-chooser-active {
      transition: .3s all;
      background: #f0f0f0;
    }

    .login-chooser-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100%;
      width: 36px;
      height: 36px;
      background: red;
      margin-right: 8px;
    }

    .login-chooser-ug {
      background: #cf1322;
      color: #fff;
    }

    .login-chooser-pg {
      background: #0958d9;
      color: #fff;
    }

    .login-chooser-content {}

    .login-chooser-tag {
      padding: 4px;
      background: rgba(0, 0, 0, .2);
      font-size: 12px;
      margin-left: 8px;
    }

    .login-chooser-tag-jw {
      background: #ffe7ba;
    }

    .login-chooser-tag-ty {
      background: #fff1f0;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    margin-right: 16px;

    .login-input {
      margin-top: 32px;
      width: 100%;
      height: 70px;
    }

    .login-vcode {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .login-input {
        flex: 1;
      }

      .vcode-image {
        width: 70px;
        height: 70px;
        margin-top: 36px;
        margin-left: 16px;
      }
    }

    .login-warning {
      margin-top: 32px;
    }
  }

  .login-button {
    height: 60px;
    margin: 16px 32px;

    .watch-button {
      height: 60px;
      font-size: 18px;
    }
  }
}
</style>