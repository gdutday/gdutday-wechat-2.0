<template>
  <view>
    <Ztl>
      <template v-slot:navBack>
        <view>{{}}</view>
      </template>
      <template v-slot:navName>
        <view>成绩</view>
      </template>
    </Ztl>
    <view class="w-1 p-3">
      <ming-container :key="keyValue">
        <template v-slot:title> <text>绩点</text> </template>
        <template v-slot:desc>
          <text
            >点击下方可以查看有关绩点的图表（由于VUE3生态仍未普及，下方图表暂时无法做到实时改变，抱歉！）</text
          >
        </template>
        <view
          @tap="changeIsShow"
          class="w-1 flex-center"
          :style="{ height: '40px' }"
        >
          <text
            >我的平均绩点是：<text
              class="text-warning title-font"
              v-if="!isNaN(getAllExamInfo.GPA)"
              >{{ getAllExamInfo.GPA }}</text
            >
            <text class="text-warning title-font" v-else> 输 </text>
          </text>
        </view>
        <view class="w-1" v-if="isShow">
          <ming-container class="w-1">
            <template v-slot:title>
              <text>平均绩点变化情况</text>
            </template>
            <template v-slot:desc>
              <text>为了制造六边形战士，此处的绩点至多展示到大三下学期</text>
            </template>
            <template>
              <qiun-data-charts
                type="radar"
                :chartData="chartsDataGPASix"
                class="w-1 px-2"
              />
            </template>
          </ming-container>
          <ming-container class="w-1">
            <template v-slot:title> <text>平均绩点</text> </template>
            <template v-slot:desc>
              <text>平均绩点计算原则</text>
            </template>

            <qiun-data-charts
              type="rose"
              :chartData="chartsDataGPA"
              background="none"
              class="w-1 px-2"
            />
          </ming-container>
        </view>
      </ming-container>

      <set-exam-info class="w-1"></set-exam-info>
      <all-exam
        class="w-1"
        :allExamInfo="getAllExamInfo.currentExam"
      ></all-exam>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer.vue";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts";
import SetExamInfo from "@/components/content/grade/SetExamInfo.vue";
import AllExam from "@/components/content/grade/AllExam.vue";
import { getStorageSync, caculateGPA, averageGPA } from "@/utils/common";
export default {
  components: {
    qiunDataCharts,
    Ztl,
    MingContainer,
    SetExamInfo,
    AllExam,
  },

  setup() {
    let isShow = ref(false);
    const store = useStore();
    // const getExam = computed(() => {
    //   return getStorageSync("exam");
    // });
    //由于目前UCharts仍不支持VUE3所以此处使用固定数据
    //下方冗杂的代码都是用于处理此数据
    // let examInfo = {};
    // examInfo = getExam.value;
    // let examIndex = Object.keys(examInfo);
    // let newArr = [];
    // let GPAofSix = [0, 0, 0, 0, 0, 0];
    // for (let i = 0; i < examIndex.length; i++) {
    //   GPAofSix[i] = averageGPA(examInfo[examIndex[i]], "gp"); //这一行用于求平均数
    //   newArr.push(...examInfo[examIndex[i]]); //这一行用于数组结构
    // }
    // let GPA = caculateGPA(newArr, "gp"); //这一行用于计算各科的绩点哪个比较高

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

    const changeIsShow = () => {
      console.log(isShow.value);
      isShow.value = !isShow.value;
    };

    const terms = ["大一上", "大一下", "大二上", "大二下", "大三上", "大三下"];
    //由于目前UCharts仍不支持VUE3所以此处使用固定数据
    const chartsDataGPASix = {
      categories: terms,
      series: [
        {
          name: "各个学期的平均绩点",
          data: getGPAOfSix.value,
        },
      ],
    };

    const chartsDataGPA = {
      series: [
        {
          data: getGPAStrength.value,
        },
      ],
    };
    init();
    onMounted(() => {});

    return {
      chartsDataGPASix,
      chartsDataGPA,
      getAllExamInfo,
      isShow,
      changeIsShow,
    };
  },
};
// };
</script>

<style lang="scss" scoped>
.charts-box {
  width: 100%;
  height: 200px;
}
</style>