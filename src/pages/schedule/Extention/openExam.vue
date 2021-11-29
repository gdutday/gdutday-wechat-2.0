<template>
  <view>
    <Ztl class="ztl">
      <template v-slot:navName>
        <div>考试安排</div>
      </template>
    </Ztl>
    <view class="exam-container">
      <view v-for="(item, index) of 1" :key="index" class="exam-item"></view>
    </view>
  </view>
</template>

<script>
import Ztl from "@/components/common/Ztl.vue";
export default {
  components: {
    Ztl,
  },
};
</script>

<style lang="scss" scoped>
.exam-container {
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .exam-item {
    padding: 35px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>