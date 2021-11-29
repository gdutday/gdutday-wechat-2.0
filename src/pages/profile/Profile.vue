<template>
  <view class="content w-1 h-1">
    <view v-if="isLogin">
      <view class="mw w-1">
        <my-welcome></my-welcome>
      </view>
      <view class="mw-list depth-4">
        <view
          v-for="(item, index) of list"
          :key="index"
          class="mw-list-item w-1"
        >
          <view class="mw-list-item-info">
            <image
              style="height: 20px; width: 20px"
              class="myicon mr-2"
              :src="'/static/my_index/' + item.icon + '.png'"
              mode=""
            />
            <view>{{ item.text }}</view>
          </view>
          <view>···</view>
        </view>
      </view>
    </view>
    <view v-else class="w-1 h-1">
      <Login />
    </view>
  </view>
</template>

<script>
import { useStore, ref } from "vuex";
import { computed } from "vue";
import Login from "./Login.vue";
import MyWelcome from "@/components/content/profile/my/MyWelcome.vue";
import { getStorageSync } from "@/utils/common.js";

export default {
  setup() {
    const store = useStore();
    const list = [
      {
        icon: "account",
        text: "用户信息与数据管理",
      },
      {
        icon: "personal",
        text: "主题设置",
      },
      {
        icon: "feedback",
        text: "意见反馈",
      },
      {
        icon: "problem",
        text: "常见问题",
      },
      {
        icon: "about",
        text: "关于我们",
      },
      {
        icon: "github",
        text: "开源总览",
      },
    ];

    const isLogin = computed(() => {
      return store.state.common.isLogin;
    });

    return {
      isLogin,
      list,
    };
  },
  components: {
    Login,
    MyWelcome,
  },
};
</script>

<style lang="scss" scoped>
.content {
  background: #fff;
  .mw {
    height: 800rpx;
  }
  .mw-list {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .mw-list-item {
      padding: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .mw-list-item-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
    }
  }
}
</style>
