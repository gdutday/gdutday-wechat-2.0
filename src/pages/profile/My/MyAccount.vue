<template>
  <view class="content">
    <Ztl>
      <template v-slot:navName>
        <view>管理我的小号号</view>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>设置及账号管理</text> </template>
        <template v-slot:desc>
          <text
            >在这里可以刷新课程表，还可以退出账号登录。如果需要刷新课表且登陆状态失效，那么会进入验证码界面，填写正确后，在登录状态未过期的一段时间内，不用提供验证码也可刷新</text
          >
        </template>
        <template v-slot:default>
          <view class="w-1 account-container">
            <view
              class="w-1 account-info"
              v-for="(item, index) of account"
              :key="index"
            >
              <view>{{ item.text }}</view>

              <view class="account-button">
                <watch-button
                  class="w-1 h-1 flex-center"
                  :value="item.btn"
                  @tap="open(item.operation)"
                ></watch-button>
              </view>
            </view>
            <view class="account-logout mt-4 w-1">
              <watch-button
                class="w-1 h-1 flex-center small-title-font"
                value="退出登录"
                @tap="logout"
              ></watch-button>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
    <ming-modal @close="close" :isShow="isShow" class="w-1 h-1" v-if="isShow">
      <template v-slot:default>
        <vcode-platform
          :vcode="vcode"
          :bgColor="getThemeColor"
          @afterRefresh="afterRefresh"
        ></vcode-platform>
      </template>
    </ming-modal>
  </view>
</template>

<script>
import { onMounted, reactive, toRefs, computed, ref } from "vue";
import { useStore } from "vuex";
// import CryptoJS from "@/utils/crypto-js";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import WatchButton from "@/components/common/WatchButton";
import MingModal from "@/components/common/MingModal";
import vcodePlatform from "@/components/content/profile/VcodePlatform.vue";
import { throttle, debounce } from "@/utils/common";

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
  initVuex,
  getStorageSync,
  filterSchedule,
  handleSchedule,
} from "@/utils/common.js";

export default {
  components: {
    Ztl,
    MingContainer,
    WatchButton,
    MingModal,
    vcodePlatform,
  },
  setup(props) {
    const store = useStore();
    let fatherMethod;
    const open = (operation) => {
      uni.showLoading({
        title: "刷新中",
      });
      fatherMethod = operation;
      operation();
    };

    const afterRefresh = () => {
      fatherMethod();
    };

    //控制遮罩的打开与关闭
    let isShow = computed(() => {
      return store.state.scheduleInfo.isShow;
    });
    const close = (val) => {
      store.commit("scheduleInfo/setIsShow", { isShow: false });
    };

    //获取未来考试
    const _getFutureExamInfo = () => {
      return getFutureExamInfo(getStorageSync("jSessionId"))
        .then((res, req) => {
          let futureExam = res.data;
          uni.setStorageSync("futureExam", futureExam);
          store.commit("exam/setFutureExam", { futureExam: futureExam });
          uni.hideLoading();
          uni.showToast({
            title: "刷新考试成功",
            duration: 2000,
          });
        })
        .catch((err) => {
          store.commit("scheduleInfo/setIsShow", { isShow: true });
          console.log(err);
          uni.hideLoading();
          uni.showToast({
            title: "刷新考试寄寄",
            duration: 2000,
            icon: "error",
          });
        });
    };

    //获取以前考试
    const _getPastExamAPIExamInfo = () => {
      return getPastExamAPIExamInfo(getStorageSync("jSessionId"))
        .then((res, req) => {
          let exam = res.data;
          uni.setStorageSync("exam", exam);
          store.commit("exam/setExam", { exam: exam });
          store.commit("exam/setCurrentExam", { termIndex: [0, 0, 0] });
          store.commit("exam/setGPAOfSix");
          uni.hideLoading();
          uni.showToast({
            title: "刷新成绩成功",
            duration: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
          store.commit("scheduleInfo/setIsShow", { isShow: true });
          uni.hideLoading();
          uni.showToast({
            title: "刷新成绩寄寄",
            duration: 2000,
            icon: "error",
          });
        });
    };

    //获取课程表
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
            title: "刷新课表陈坤",
            duration: 2000,
          });
          store.commit("common/setIsLogin", { isLogin: true });
        })
        .catch((err) => {
          console.log(err);
          console.log("err");
          uni.hideLoading();
          store.commit("scheduleInfo/setIsShow", { isShow: true });
          uni.showToast({
            title: "刷新课表鸡鸡",
            duration: 2000,
          });
        });
    };

    //登出
    const logout = () => {
      uni.removeStorageSync("pickWeekSchedule");
      uni.removeStorageSync("futureExam");
      uni.removeStorageSync("exam");
      uni.removeStorageSync("weeksData");
      initVuex();
      uni.navigateBack({
        delta: 1,
      });
      uni.showToast({
        title: "退出成功",
        duration: 2000,
      });
    };

    const refreshSchedule = debounce(_getScheduleInfo, 1500);

    const refreshFutureExam = debounce(_getFutureExamInfo, 1500);

    const refreshExam = debounce(_getPastExamAPIExamInfo, 1500);

    const refreshAll = debounce(() => {
      _getPastExamAPIExamInfo();
      _getFutureExamInfo();
      _getScheduleInfo();
    }, 1500);

    const account = [
      {
        text: "刷新课程表",
        btn: "刷新",
        operation: refreshSchedule,
      },
      {
        text: "刷新考试安排",
        btn: "刷新",
        operation: refreshFutureExam,
      },
      {
        text: "刷新成绩",
        btn: "刷新",
        operation: refreshExam,
      },
      {
        text: "全部刷新",
        btn: "刷新",
        operation: refreshAll,
      },
    ];
    return {
      account,
      open,
      logout,
      close,
      afterRefresh,
      isShow,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  height: 100%;
}
.account-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .account-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-bottom: 3px solid #ccc;

    .account-button {
      width: 60px;
      height: 70%;
    }
  }

  .account-logout {
    height: 60px;
  }
}
</style>