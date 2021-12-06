<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <view>管理我的小号号</view>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>设置及账号管理</text> </template>
        <template v-slot:desc>
          <text>在这里可以刷新课程表，还可以退出账号登录</text>
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
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import WatchButton from "@/components/common/WatchButton";
import { initVuex } from "@/utils/common";
export default {
  components: {
    Ztl,
    MingContainer,
    WatchButton,
  },
  setup(props) {
    const open = (operation) => {
      operation();
    };

    const refreshSchedule = () => {
      console.log(111);
    };
    const logout = () => {
      uni.removeStorageSync("pickWeekSchedule");
      uni.removeStorageSync("futureExam");
      uni.removeStorageSync("exam");
      uni.removeStorageSync("weeksData");
      initVuex();
      uni.navigateBack({
        delta: 1,
      });
    };

    const account = [
      {
        text: "刷新课程表",
        btn: "刷新",
        operation: refreshSchedule,
      },
      // {
      //   icon: "personal",
      //   text: "主题设置",
      // },
      // {
      //   icon: "feedback",
      //   text: "意见反馈",
      //   operation: openFeedback,
      // },
      // {
      //   icon: "problem",
      //   text: "常见问题",
      // },
      // {
      //   icon: "about",
      //   text: "关于我们",
      //   operation: openAbout,
      // },
      // {
      //   icon: "github",
      //   text: "开源总览",
      // },]
    ];
    return {
      account,
      open,
      logout,
    };
  },
};
</script>

<style lang="scss" scoped>
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