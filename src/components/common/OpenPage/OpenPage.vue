<template>
  <view
    class="openpage transition-2 opacity-9 py-4 px-3 rounded-4 depth-ming w-100"
    :style="{
      zIndex: 99999,
      top: toastIsShow ? 0 : '-1000px',
    }"
    @tap="close"
  >
    <view class="position-relative content rounded-4 px-4 py-3 w-1">
      <view class="toast-title"
        ><view class="fw-2 my-2">{{ title }}</view></view
      >
      <view class="mt-2">
        <div v-for="listItem of list" :key="listItem">
          <div class="list">
            {{ listItem }}
          </div>
        </div>
      </view>
      <!-- <view class="decration position-absolute flex-center">“</view> -->
      <!-- <view
        class="lovers flex-center mx-3 my-2 px-2 py-1 rounded-4"
        @tap.stop="tapToLove"
        :class="loverStatus ? ' animation-ripple' : 'animation-fade'"
      >
        <text class="iconfont icon-icon-test31 mr-2" v-if="loverStatus"></text>
        <text v-else class="iconfont icon-icon-test32 mr-2 lover-select"></text>
        <text>{{ getLoversCount }}人喜欢</text>
      </view> -->
    </view>
  </view>
</template>

<script>
import { onMounted, ref } from 'vue'
import { debounce } from '@/utils/common.js'
import { getRecruitInfo } from '@/network/ssxRequest/ssxInfo/recruit.js'
export default {
  props: {
    title: {
      type: String,
      default: '加入我们',
    },
    content: {
      type: String,
      default: '热爱学习，热爱打代码的你',
    },
    toastIsShow: {
      type: Boolean,
      default: false,
    },
    peopleCount: {
      type: Number,
      default: 66,
    },
  },
  setup(props, { emit }) {
    let loverStatus = ref(true)
    let getLoversCount = ref(props.peopleCount)
    let timer = null //用于设置定时器
    //切换是否喜欢
    const tapToLove = () => {
      loverStatus.value = !loverStatus.value
      !loverStatus.value ? getLoversCount.value++ : getLoversCount.value--
      // clearTimeout(timer)
      // timer = setTimeout(() => {
      //   close();
      // }, 4000);
    }

    const close = () => {
      emit('close')
    }

    const getListData = () => {
      getRecruitInfo().then(res => {
        console.log(res)
      })
    }

    const list = [
      '🎈 加入开发者团队: 加入广工电协网络组',
      '🎈 加入我们：加入广工电协',
      '🎈 微信搜索：广工电协，了解更多我们的信息',
      '🎈 22新生Q群：528317221，了解招新前沿信息',
      '🎈 我要报名招新: 搜索微信小程序：电协招新',
    ]

    onMounted(() => {
      // getListData()
    })

    return {
      close,
      tapToLove,
      loverStatus,
      getLoversCount,
      list,
    }
  },
}
</script>

<style lang="scss" scoped>
.openpage {
  position: absolute;
  background: gray;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 60px;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: rgba(255, 255, 255, 0.5);

    .toast-title {
      font-size: 40px;
    }

    .decration {
      text-align: center;
      height: 120px;
      top: -30%;
      line-height: 120px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 120px;
    }

    .lovers {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.7);

      .lover-select {
        color: red;
      }
    }
  }
}

.list {
  padding-top: 10px;
}
</style>
