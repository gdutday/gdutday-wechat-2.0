<template>
  <ming-modal @close="close" :isShow="isShow">
    <template v-slot:default>
      <view class="animation-shake class-all">
        <ming-container class="w-1 charts-box">
          <template v-slot:title>
            <text>平均绩点变化情况</text>
          </template>
          <template v-slot:desc>
            <text>为了制造六边形战士，此处的绩点至多展示到大三下学期</text>
          </template>
          <template>
            <qiun-data-charts
              type="radar"
              :canvas2d="true"
              :chartData="chartsDataGPASix"
              class="w-1 px-2"
            />
          </template>
        </ming-container>
        <ming-container class="w-1 charts-box">
          <template v-slot:title> <text>平均绩点</text> </template>
          <template v-slot:desc>
            <text>平均绩点计算原则</text>
          </template>
          <qiun-data-charts
            type="rose"
            :chartData="chartsDataGPA"
            background="none"
            :canvas2d="true"
            :opts="{ title }"
            class="w-1 px-2"
          />
        </ming-container>
      </view>
    </template>
  </ming-modal>
</template>

<script>
import MingModal from "@/components/common/MingModal";
import MingContainer from "@/components/common/MingContainer";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { getStorageSync, caculateGPA, averageGPA } from "@/utils/common";
import { useMingModal } from "@/hooks/index.js";
export default {
  components: {
    MingModal,
    MingContainer,
    qiunDataCharts,
  },
  setup() {
    const store = useStore();
    const terms = ["大一上", "大一下", "大二上", "大二下", "大三上", "大三下"];

    const { isShow, close } = useMingModal();

    const getExam = computed(() => {
      return store.state.exam.exam;
    });

    // 由于目前UCharts仍不支持VUE3所以此处使用固定数据;
    // 下方冗杂的代码都是用于处理此数据;
    let examInfo = {};
    examInfo = getExam.value;
    let examIndex = Object.keys(examInfo);
    let newArr = [];
    let GPAofSix = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < examIndex.length; i++) {
      GPAofSix[i] = averageGPA(examInfo[examIndex[i]], "gp"); //这一行用于求平均数
      newArr.push(...examInfo[examIndex[i]]); //这一行用于数组结构
    }
    let GPA = caculateGPA(newArr, "gp"); //这一行用于计算各科的绩点哪个比较高

    const getAllExamInfo = computed(() => {
      return store.state.exam;
    });

    const getGPAStrength = computed(() => {
      return store.state.exam.GPAStrength;
    });

    const getGPAOfSix = computed(() => {
      return store.state.exam.GPAOfSix;
    });

    const init = () => {
      store.commit("exam/setExam", { exam: getStorageSync("exam") });
      store.commit("exam/setCurrentExam", { termIndex: [0, 0, 0] });
      store.commit("exam/setGPAOfSix");
      console.log(getGPAOfSix.value);
      console.log(getGPAStrength.value);
      console.log(getAllExamInfo.value);
    };

    const chartsDataGPASix = {
      categories: terms,
      series: [
        {
          name: "各个学期的平均绩点",
          data: GPAofSix,
        },
      ],
    };

    const chartsDataGPA = {
      series: [
        {
          data: GPA,
        },
      ],
    };

    onMounted(() => {
      init();
    });

    return {
      isShow,
      close,
      getGPAOfSix,
      getGPAStrength,
      getAllExamInfo,
      chartsDataGPA,
      chartsDataGPASix,
      GPA,
    };
  },
};
</script>

<style lang="scss" scoped>
.class-all {
  height: 400px;
  width: 300px;
  background-color: #fff;

  .charts-box {
    width: 100%;
    height: 200px;
  }
}
</style>