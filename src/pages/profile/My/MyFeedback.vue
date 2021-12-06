<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <view>我要反馈意见！</view>
      </template>
      <ming-container> </ming-container>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title> <text>我要投诉！</text> </template>
        <template v-slot:desc>
          <text
            >在这里可以对gdutday提出你自己的建议噢，我们一定会看完仔细分析，争取将它做进未来的小寄里面！</text
          >
        </template>
        <template v-slot:default>
          <view class="w-1">
            <view :style="{ width: '100%', height: '40px' }">
              <watch-input v-model="title" placeholder="标题" />
            </view>
            <view :style="{ width: '100%', height: '150px' }" class="mt-4">
              <watch-input
                textarea
                v-model="content"
                placeholder="请写出你对我们寄递右剃兔的小小的建议"
              />
            </view>
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import { toRefs, reactive } from "vue";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer";
import WatchInput from "@/components/common/WatchInput";
export default {
  components: {
    Ztl,
    MingContainer,
    WatchInput,
  },
  setup(props) {
    let feedback = reactive({
      title: "",
      content: "",
    });

    return {
      ...toRefs(feedback),
    };
  },
};
</script>

<style lang="scss" scoped>
</style>