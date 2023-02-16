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
		<!-- 添加研究生不显示 v-if="loginIsGraduteStudent==true"   -->
      <ming-container   :key="keyValue">
        <template v-slot:title> <text>绩点</text> </template>
        <template v-slot:desc>
          <text
            >点击此处可以查看有关绩点的图表（此部分组件有可能重启小程序才可见）</text
          >
        </template>
        <view
          @tap="changeIsShow"
          class="w-1 flex-center mb-3 rounded-5 shadow-lg"
          :style="{
            height: '50px',
            backgroundColor: getThemeColor.curBgSecond,
            color: getThemeColor.curTextC,
          }"
        >
          <text
            >我的平均绩点是：<text
              class="title-font px-3 py-1 rounded-5 mx-2 web-font"
              v-if="!isNaN(getAllExamInfo.GPA)"
              :style="{ backgroundColor: getThemeColor.curBg }"
              >{{ getAllExamInfo.GPA }}</text
            >
            <text class="text-warning title-font mx-2" v-else> 输 </text>
          </text>
        </view>
        <view class="w-1 animation-shake" v-if="isShow">
          <ming-container class="w-1" v-if="loginIsGraduteStudent==false">
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
          <ming-container class="w-1">
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
        <view class="show-all w-1 flex-center" @tap="changeIsShow">
          <text class="iconfont icon-icon-test37" v-if="!isShow"></text>
          <text class="iconfont icon-icon-test35" v-else></text>
        </view>
      </ming-container>
	  <!-- 添加研究生不显示 -->
      <set-exam-info class="w-1" :themeColor="getThemeColor"></set-exam-info>
	  <!-- 如果是研究生上面全部隐藏 -->
      <all-exam 
        class="w-1"
        :allExamInfo="getAllExamInfo.currentExam"
        :themeColor="getThemeColor"
      ></all-exam>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, provide, reactive, ref, inject } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import MingContainer from "@/components/common/MingContainer.vue";
import qiunDataCharts from "@/components/qiun-data-charts/qiun-data-charts";
import SetExamInfo from "@/components/content/grade/SetExamInfo.vue";
import AllExam from "@/components/content/grade/AllExam.vue";
import { getStorageSync, caculateGPA, averageGPA } from "@/utils/common";
import { onTabItemTap } from "@dcloudio/uni-app";
export default {
  components: {
    qiunDataCharts,
    Ztl,
    MingContainer,
    SetExamInfo,
    AllExam,
  },
  /***研究生start**/
  data() {
	return {
		loginIsGraduteStudent: false, // 登录页面 身份状态
	}
  },
  beforeMount() {
	this.loginIsGraduteStudent = getStorageSync('loginIsGraduteStudent');
  },
  /***研究生end**/
  setup() {
    const store = useStore();
    let isRefresh = ref(0);
    provide("isRefresh", isRefresh);

    let isShow = ref(false);
    const getExam = computed(() => {
      return store.state.exam.exam;
    });
    onTabItemTap(() => {
      isRefresh.value++;
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

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    let themeColor = reactive(getThemeColor.value);
    provide("themeColor", themeColor);

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
    init();
    onMounted(() => {});

    return {
      chartsDataGPASix,
      chartsDataGPA,
      getAllExamInfo,
      isShow,
      changeIsShow,
      getThemeColor,
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

.show-all {
  height: 30px;

  .iconfont {
    font-size: 30px;
  }
}
</style>