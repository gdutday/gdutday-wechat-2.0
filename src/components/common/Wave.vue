<template>
  <view class="w-1 wave" :style="{ backgroundColor: themeColor.curBg }">
    <!-- 这里的颜色其实是地下波浪的，因为旋转的是里面的wave -->
    <view class="content">
      <view class="pic">
        <slot name="pic">
          <image :src="headerUrl" v-if="headerUrl" mode="" />
          <view class="flex-center h-1 w-1 opacity-3 bg-white" v-else @tap="wxLogin"><text>点击登录</text></view>
        </slot>
      </view>
      <view class="name"
        ><slot name="name">
          <text>{{ nickName + '，' }}你好呀~，辛苦了~</text>
        </slot></view
      >
    </view>
  </view>
</template>

<script>
import { watch, ref, onMounted } from 'vue'
import { getStorageSync } from '@/utils/common.js'
export default {
  props: {
    themeColor: {
      type: Object,
      default: () => {
        curBg: 'fff'
      },
    },
  },
  onShow(){
	  // 研究生登录后显示用户姓名，不确定开发者后续是否有其他模块上线，所以只对研究生生效
	  if(getStorageSync("loginIsGraduteStudent")){
		  // console.log("显示姓名！");
		  let graduteUseriInfo = getStorageSync("userInfoGradute");
		  if(graduteUseriInfo){
			this.nickName = graduteUseriInfo.XM;
		  }
	  }
  },
  setup() {
    let headerUrl = ref('')
    let nickName = ref('吴彦祖')

    if (getStorageSync('userInfo')) {
      headerUrl.value = getStorageSync('userInfo').avatarUrl
      nickName.value = getStorageSync('userInfo').nickName
    }

    //************************* */
    const wxLogin = () => {
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          console.log(loginRes)
          // 获取用户信息
        },
      })

      uni.getUserProfile({
        desc: '用于千与千寻发帖管理',
        success: function (infoRes) {
          console.log(infoRes)
          uni.setStorageSync('userInfo', {
            nickName: infoRes.userInfo.nickName,
            avatarUrl: infoRes.userInfo.avatarUrl,
          })
          nickName.value = infoRes.userInfo.nickName
          headerUrl.value = infoRes.userInfo.avatarUrl
          console.log('用户昵称为：' + infoRes.userInfo.nickName)
        },
      })
    }

    return {
      headerUrl,
      nickName,
      wxLogin,
    }
  },
}
</script>

<style lang="scss" scoped>
.wave {
  height: 101%;
  position: relative;
  align-items: center;
  min-height: 100%;
  overflow: hidden;

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 50%;
    min-width: 170%;
    min-height: 250%;
    background: linear-gradient(#90cad5, #fce1c2);
    animation: rotate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  &:before {
    bottom: 17%;
    border-radius: 45%;
    animation-duration: 7s;
  }

  &:after {
    bottom: 12%;
    opacity: 0.5;
    border-radius: 47%;
    animation-duration: 7s;

    // background: linear-gradient(#fab9b9, #fff);
  }

  .content {
    width: 100%;
    height: 270rpx;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99;

    .pic {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;

      // border: 1px solid #fff;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      display: inline;
      margin-top: 20rpx;
      height: 70rpx;
      display: flex;
      justify-content: center;
      align-content: center;
    }
  }
}
</style>
