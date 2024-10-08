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
          <watch-input type="text" class="" title="学号" :value='username' v-model="username" placeholder="请输入学号"
            :themeColor="getThemeColor" />
        </view>
        <view class="w-1 login-input">
          <watch-input type="text" class="" v-model="password" isPsw="true" :value='password' title="密码"
            placeholder="请输入密码" :themeColor="getThemeColor" />
        </view>


        <div class="w-1 login-vcode" v-if='shouldDisplayVCode'>
          <view class="login-input">
            <watch-input type="text" class="" v-model="vCodeValue" title="验证码" placeholder="请输入验证码"
              :themeColor="getThemeColor" />
          </view>
          <image class="vcode-image" :src="'data:image/png;base64,' + vCodePic"
            v-if="vCodePic && vCodeStatus === VCODE_STATUS.EXIST" @tap="getVerV2InPage" />
          <div v-else-if="vCodeStatus === VCODE_STATUS.LOADING" class="vcode-placeholder">{{ '加载中' }}</div>
          <div v-else-if="vCodeStatus === VCODE_STATUS.ERROR" class="vcode-placeholder" @tap="getVerV2InPage">{{
            '加载失败\n点我重试'
          }}</div>
          <div v-else-if="vCodeStatus === VCODE_STATUS.EMPTY" class="vcode-placeholder" @tap="getVerV2InPage">{{
            '初次进入\n加载中'
          }}</div>
        </div>
      </div>

      <div class="login-warning" v-if="errorMsg">
        {{ errorMsg }}
      </div>

      <div class="login-button">
        <view class="watch-button w-1 my-2">
          <watch-button value="登录" :themeColor="getThemeColor" @tap="loginAction"></watch-button>
        </view>
      </div>
      <more-info @onSelected='onSelected' :isConfirm='isConfirmRules'></more-info>
    </div>
    <ming-toast :isShow="toastIsShow" @resumeToastIsShow="hideToast" :content="warningInfo" :toastType="toastType"
      :themeColor="getThemeColor"></ming-toast>
  </view>
</template>

<script>
import {ref, computed, watch, onUnmounted} from "vue";
import * as LOGIN_ENUM from "@/modules/login/enum";
import {
  getStorageSync,
  setStorageSync
} from "@/utils/common.js";
import {REQUEST_CLIENT_ERROR} from '@/network/enum.js'
import Bus from '@/utils/bus'

// hooks
import {useStore} from 'vuex'
import useLogin from "@/hooks/loginHooks/useLogin.js";
import useUserData from "@/hooks/userDataHooks/useUserData.js";
import useLoginParams from './hooks/useLoginParams'
import useErrorMsg from './hooks/useErrorMsg'
import useLoginChooser from './hooks/useLoginChooser'
import {useToast} from "@/hooks/index.js";

// 组件
import Ztl from "@/components/common/Ztl.vue";
import WatchInput from '@/components/common/WatchInput.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import MoreInfo from './components/moreInfo.vue';
import MingToast from '@/components/common/MingToast.vue'

// 标识刷新
let isRefreshRef = ref(false)

// 标识二维码
export const VCODE_STATUS = {
  EMPTY: 0, // 初次进入
  LOADING: 1, // 加载中
  EXIST: 2, // 加载成功
  ERROR: 3, // 加载失败
}

export default {
  onLoad(option = {}) {
    console.log('option', option);
    if (!!option.isRefresh) {
      isRefreshRef.value = true
    }
  },
  components: {
    Ztl,
    WatchInput,
    WatchButton,
    MoreInfo,
    MingToast
  },
  setup() {
    onUnmounted(() => {
      isRefreshRef.value = false
    })

    const locked = ref(false)
    const vCodeStatus = ref(VCODE_STATUS.EMPTY)

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

    const {getSchedule, getExam, getGrade, getVerV2, getTermIdV2, getAllData} = useUserData();
    const {userType, loginType, loginChooserContent, setChooser} = useLoginChooser(getCurrentLoginType(),
      getCurrentUserType())

    const {errorMsg, setErrorMsg, initErrorMsg} = useErrorMsg()
    const onChoose = (operation) => {
      operation()

      // 刷新errMsg
      initErrorMsg()
    }

    const {
      username,
      password,
      vCodePic,
      vCodeValue,
    } = useLoginParams()

    const {
      toastType,
      showToast,
      hideToast,
      toastIsShow,
      warningInfo
    } = useToast()

    const shouldDisplayVCode = computed(() => {
      return loginType.value === 1 && userType.value === 1
    })

    const loginAction = async () => {
      if (!isConfirmRules.value) {
        // 错误code以及错误消息
        setErrorMsg('必须同意用户服务条款才可登陆哦～')
        return
      }

      if (locked.value) return
      locked.value = true



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

      locked.value = false

      console.log('[isError, data]', isError, data);

      if (isError) {
        const {code, msg} = data

        // 错误code以及错误消息
        setErrorMsg(msg)

        showToast({
          toastType: 'warning',
          warningInfo: msg,
        })

        getVerV2InPage()
        return
      }

      // 登陆已经成功了
      Bus.emit('login')
      // 刷新页无需callback
      if (isRefreshRef.value) {
        // 登陆成功的callback
        uni.navigateBack({
          delta: 1,
        });
        return
      }

      uni.showLoading({title: '正在加载数据'})

      const [isGetAllDataError, errorMsg] = await getAllData()

      uni.hideLoading()
      if (isGetAllDataError) {
        showToast({
          toastType: 'warning',
          warningInfo: errorMsg.msg,
        })
        setErrorMsg(errorMsg.msg)
        return
      }

      uni.navigateBack({
        delta: 1,
      });
    };

    const getVerV2InPage = async () => {
      if (vCodeStatus.value === VCODE_STATUS.LOADING) return

      vCodeStatus.value = VCODE_STATUS.LOADING

      const [isError, res] = await getVerV2();

      vCodeStatus.value = VCODE_STATUS.EXIST
      console.log('resres', [isError, res]);

      if (isError) {
        console.log("isError");

        vCodeStatus.value = VCODE_STATUS.ERROR

        const {code, msg} = res

        // 错误code以及错误消息
        setErrorMsg(msg)

        showToast({
          toastType: 'warning',
          warningInfo: msg,
        })


        return;
      }

      const {verCode} = res.data;

      if (verCode) {
        vCodePic.value = verCode
      }
    };

    watch(() => shouldDisplayVCode.value,
      () => {
        if (shouldDisplayVCode.value) {
          getVerV2InPage()
        }
      }, {
      immediate: true,
    })

    const isConfirmRules = ref(false)
    const onSelected = (newValue) => {
      isConfirmRules.value = newValue
    }

    return {
      // 登陆信息
      username,
      password,
      vCodePic,
      vCodeValue,
      vCodeStatus,
      VCODE_STATUS,

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
      shouldDisplayVCode,
      isConfirmRules,
      onSelected,

      // 错误消息
      errorMsg,

      // toast
      toastType,
      showToast,
      hideToast,
      toastIsShow,
      warningInfo

    };
  },
};
</script>

<style scoped lang="scss">
.login {
  padding-bottom: 60px;

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
    margin-bottom: 40px;

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
        width: 90px;
        height: 70px;
        margin-top: 46px;
        margin-left: 16px;
      }

      .vcode-placeholder {
        margin-top: 46px;
        width: 90px;
        height: 70px;
        background: #fff1f0;
        color: #000;
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: pre-line;
        text-align: center;
        margin-left: 16px;
        border-radius: 4px;
      }
    }


  }

  .login-warning {
    margin-top: -12px;
    font-size: 14px;
    margin-left: 16px;
    margin-right: 16px;
    padding: 8px 8px;
    border-radius: 8px;
    color: #a8071a;
    background: #ffccc7;
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