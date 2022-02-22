<template>
  <ming-container>
    <template v-slot:title> <text>选项</text> </template>
    <template v-slot:desc>
      <text>在这里你可以筛选成绩的选项</text>
    </template>
    <template>
      <view class="w-1 content" :style="{ color: themeColor.curTextC }">
        <picker-view
          class="picker-view opacity-1"
          :indicator-style="indicatorStyle"
          :value="value"
          @change="change($event)"
        >
          <picker-view-column :style="{ backgroundColor: themeColor.curBg }">
            <view
              class="item flex-center"
              v-for="(item, index) in includeXuan"
              :key="index"
              >{{ item }}</view
            >
          </picker-view-column>
          <picker-view-column
            :style="{ backgroundColor: themeColor.curBgSecond }"
          >
            <view
              class="item flex-center"
              v-for="(item, index) in terms"
              :key="index"
              >{{ item }}</view
            >
          </picker-view-column>
          <picker-view-column :style="{ backgroundColor: themeColor.curBg }">
            <view
              class="item flex-center"
              v-for="(item, index) in termsTime"
              :key="index"
              >{{ item }}</view
            >
          </picker-view-column>
        </picker-view>
      </view>
    </template>
  </ming-container>
</template>

<script>
import { useStore } from "vuex";
import MingContainer from "@/components/common/MingContainer.vue";

export default {
  components: {
    MingContainer,
  },
  props: {
    themeColor: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const change = (event) => {
      console.log(event);
      store.commit("exam/setCurrentExam", { termIndex: event.detail.value });
    };

    store.commit("exam/setCurrentExam", { termIndex: [0, 0, 0] });
    const includeXuan = ["包含选修", "不包含选修", "只包含选修"];
    const terms = ["所有学期", "大一", "大二", "大三", "大四"];
    const termsTime = ["整学期", "上学期", "下学期"];

    return {
      includeXuan,
      terms,
      termsTime,
      change,
      ...props,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .picker-view {
    width: 100%;
    height: 80%;

    .item {
      text-align: center;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 20px;
    }
  }
}
</style>