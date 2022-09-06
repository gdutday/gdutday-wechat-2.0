<template>
  <view class="content w-1 h-1 position-relative">
    <view v-if="isLogin" :style="{ overflow: 'hidden' }">
      <view class="mw w-1">
        <my-welcome></my-welcome>
      </view>
      <view class="m-5 animation-slide-bottom depth-2">
        <button
          v-for="(item, index) of list"
          :key="index"
          class="flex bg-white py-1"
          :open-type="item.icon"
          @tap="open(item.operation)"
        >
          <view class="w-1 px hg flex-row j-sb">
            <view class="flex-row h-1 a-center">
              <image
                style="height: 20px; width: 20px"
                class="myicon mr-2"
                :src="'/static/my_index/' + item.icon + '.png'"
                mode=""
              />
              <text>{{ item.text }}</text>
            </view>
          </view>
          <i>...</i>
        </button>
      </view>
    </view>
    <view v-else class="w-1 h-1">
      <Login />
    </view>
  </view>
</template>

<script>
import { useStore } from 'vuex'
import { computed, provide, reactive, onMounted } from 'vue'
import Login from './Login.vue'
import MyWelcome from '@/components/content/profile/my/MyWelcome.vue'
import { getStorageSync } from '@/utils/common.js'

export default {
  setup() {
    const store = useStore()
    const openAccount = () => {
      uni.navigateTo({
        url: 'My/MyAccount',
      })
    }

    const openFeedback = () => {
      uni.navigateTo({
        url: 'My/MyFeedback',
      })
    }

    const openAbout = () => {
      uni.navigateTo({
        url: 'My/MyAbout',
      })
    }

    const openProblem = () => {
      uni.navigateTo({
        url: 'My/MyCommonProblem',
      })
    }
    const openMark = () => {
      uni.navigateTo({
        url: 'My/MyUpdate',
      })
    }
    const openPrivacy = () => {
      uni.navigateTo({
        url: 'My/MyPrivacy',
      })
    }

    const open = operation => {
      operation()
    }
    const list = [
      {
        icon: 'account',
        text: '用户信息与数据管理',
        operation: openAccount,
      },
      // {
      //   icon: "personal",
      //   text: "主题设置",
      // },
      {
        icon: 'feedback',
        text: '意见反馈',
        // operation: openFeedback,
      },
      {
        icon: 'share',
        text: '转发给朋友',
        feedback: true,
      },
      // {
      //   icon: 'contact',
      //   text: '联系客服',
      // },
      {
        icon: 'problem',
        text: '常见问题',
        operation: openProblem,
      },
      {
        icon: 'about',
        text: '关于我们',
        operation: openAbout,
      },
      // {
      //   icon: "github",
      //   text: "开源总览",
      // },
      {
        icon: 'mark',
        text: '更新日志',
        operation: openMark,
      },
      {
        icon: 'privacy',
        text: '用户服务条款',
        operation: openPrivacy,
      },
    ]

    //************************* */

    const isLogin = computed(() => {
      return store.state.common.isLogin
    })

    return {
      open,
      isLogin,
      list,
    }
  },
  components: {
    Login,
    MyWelcome,
  },
}
</script>

<style lang="scss" scoped>
.content {
  .mw {
    height: 800rpx;
  }
  .mw-list {
    position: relative;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    z-index: 99;
    background-color: #fff;
    opacity: 0.7;
    margin-bottom: 50px;

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

button:first-child {
  border-radius: 5px 5px 0px 0px;
}
button:last-child {
  border-radius: 0px 0px 5px 5px;
}
button {
  position: relative;
  font-size: 14px;
  border-radius: 0px;
  color: inherit !important;
}
button::after {
  position: absolute;
  border: none;
  border-radius: 0px;
}
</style>
