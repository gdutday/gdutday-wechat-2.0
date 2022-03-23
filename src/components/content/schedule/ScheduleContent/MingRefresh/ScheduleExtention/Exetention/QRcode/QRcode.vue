<template>
  <view class="w-1 h-1 qrcode">
    <view class="mb-2 qrcode-title flex-center overflow-hidden"
      >入馆二维码</view
    >
    <view class="code-area mt-3">
      <image
        src="https://gitee.com/zhang-mingyuan123/pic/raw/master/20220311161357.png"
        mode=""
      />
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.qrcode {
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