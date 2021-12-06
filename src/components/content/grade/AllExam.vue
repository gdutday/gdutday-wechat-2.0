<template>
  <ming-container>
    <template v-slot:title> <text>课程成绩</text> </template>
    <template v-slot:desc>
      <text>在这里可以搜索课程名字来获取相应的成绩</text>
    </template>
    <template>
      <exam-child :allExamInfo="allExamInfo" class="w-1"></exam-child>
    </template>
  </ming-container>
</template>

<script>
import { ref, onMounted } from "vue";
import MingContainer from "@/components/common/MingContainer.vue";
import ExamChild from "@/components/content/grade/ExamChild.vue";
export default {
  props: {
    allExamInfo: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MingContainer,
    ExamChild,
  },

  setup(props) {
    onMounted(() => {
      console.log(props.allExamInfo);
    });
  },
};
</script>

<style lang="scss" scoped>
</style>