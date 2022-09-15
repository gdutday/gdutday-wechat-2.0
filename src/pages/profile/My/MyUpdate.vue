<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>更新日志</div>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>更新日志</text> </template>
        <template v-slot:desc>
          <text>更新的信息在这里！</text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            2.0.1 版本更新：课程表页面长按打开编辑课表功能（实在没太多时间开发了，更新日志就简单写一下吧！）
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer'
export default {
  components: {
    Ztl,
    MingContainer,
  },
}
</script>

<style lang="scss" scoped></style>
