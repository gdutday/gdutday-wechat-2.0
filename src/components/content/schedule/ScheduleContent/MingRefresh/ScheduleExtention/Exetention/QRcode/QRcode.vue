<template>
  <view class="w-1 h-1 qrcode">
    <view class="mb-2 qrcode-title flex-center overflow-hidden">入馆二维码</view>
    <view class="code-area mt-3">
      <view v-if="!libraryQrCode">
        <text>你还没有获取过，请去《我的》处进行获取</text>
      </view>
      <image :src="'data:image/png;base64,' + libraryQrCode" mode="" v-else />
    </view>
  </view>
</template>

<script>
import { getJavaGodShensixie } from '@/network/ssxRequest/ssxInfo/libraryCode'
import { getStorageSync, setStorageSync } from '@/utils/common'
import { onMounted, ref } from 'vue'
import QRCode from 'qrcode'
export default {
  setup() {
    const libraryQrCode = ref(getStorageSync('libraryCode'))

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
</style>
