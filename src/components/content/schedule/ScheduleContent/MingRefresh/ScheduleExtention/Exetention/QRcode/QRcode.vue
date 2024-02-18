<template>
  <view class="w-1 h-1 qrcode">
    <view class="mb-2 qrcode-title flex-center overflow-hidden">入馆二维码</view>
    <view class="code-area mt-3">
      <image :src="libraryQrCode" v-if="libraryQrCode"></image>
      <div v-else>请登录后再来获取二维码</div>
    </view>
  </view>
</template>

<script>
import {getJavaGodShensixie} from '@/network/ssxRequest/ssxInfo/libraryCode'
import {getStorageSync, setStorageSync} from '@/utils/common'
import {onMounted, ref} from 'vue'
import QR from 'qrcode-base64'

export default {
  setup() {
    const libraryQrCode = ref('')

    const setLibraryQrCode = (text) => {
      const base64 = QR.drawImg(text, {
        typeNumber: 4,
        errorCorrectLevel: 'M',
        size: 500
      })

      libraryQrCode.value = base64
    }

    onMounted(() => {
      const username = getStorageSync('username')
      if (username) {
        setLibraryQrCode(username)
      }
    })


    return {
      libraryQrCode,
    }
  },
}
</script>

<style lang="scss" scoped>
.qrcode {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .qrcode-title {
    font-size: 24px;
    height: 30px;
  }

  .code-area {
    image {
      max-width: 200px;
      max-height: 200px;
    }
  }
}

page {
  background-color: #FFFFFF;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: var(--status-bar-height);
}

.text {
  display: flex;
  justify-content: center;
  margin-top: 46rpx;
  margin-bottom: 6rpx;
  font-size: 36rpx;
  height: 44rpx;
  color: #333333;
}

.canvas {
  margin-top: 50rpx;
  margin-bottom: 36rpx;
  text-align: center;
}

.list-text {
  display: flex;
  justify-content: center;
  width: 100%;
  line-height: 60rpx;
  font-size: 28rpx;
  color: #666666;
}

.button {
  width: 88%;
  margin-top: 52rpx;

}
</style>
