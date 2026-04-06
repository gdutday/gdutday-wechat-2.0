<template>
  <view class="all-exam py-2 w-1">
    <view class="all-exam-search w-1 mb-4">
      <watch-input
        type="text"
        class=""
        title="科目"
        placeholder="请输入想要搜索的科目"
        @input="change"
        :themeColor="themeColor"
        v-model="searchValue"
      />
    </view>
    <view
      class="exam-container py-1 mt-3 w-1 overflow-hidden"
      v-if="allExamInfo.length"
    >
      <view
        class="exam-item depth-1 p-5"
        v-for="(item, index) of allExamInfo"
        :style="{ backgroundColor: getBackgroundColor(index) }"
        :key="item.cn"
        @click="changeFullClassInfoIsShow(index)"
      >
        <view class="exam-info-left">
          <view
            class="small-title-font"
            :class="[
              getIsShowAll(index)
                ? 'animation-fade'
                : 'class-name animation-shake',
            ]"
            :key="fullClassInfoIsShow"
            >{{ item.cn }}</view
          >
          <template>
            <view class="exam-info-type text-dark my-2">
              <text>{{ item.type }}</text>
              <text v-if="item.cType">{{ item.cType }}</text>
            </view>
            <view>
              {{ getTerm(item.term) ? getTerm(item.term) : item.term}}
            </view>
          </template>
        </view>
        <view class="exam-info-right">
          <text>
            <text class="small-title-font">
              <text class="flex-center">{{ item.result  ? item.result :'请先评教'}} </text></text
            ></text
          >
          <template>
            <view class="exam-info-gp text-dark">
              <text>我的绩点:{{ item.gp ? item.gp: '暂无'}}</text>
              <text>所占学分:{{ item.credit }}</text>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="exam-container py-2 w-1 animation-shake mt-3" v-else>
      <view class="exam-item-error depth-ming p-3 flex-center">
        <text class="iconfont icon-icon-test30 pr-2"></text
        ><text>搜索无结果哦~</text>
      </view>
    </view>
  </view>
</template>

<script>
import WatchInput from "@/components/common/WatchInput.vue";
import {
  computed,
  inject,
  onMounted,
  ref,
  watch,
  toRefs,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import {
  searchValueByKey,
  getStorageSync,
  throttle,
  debounce,
} from "@/utils/common";
import { simpleLightColor } from "@/static/color/color.js";
export default {
  components: {
    WatchInput,
  },
  props: {
    allExamInfo: {
      type: Array,
      default: () => [],
    },
    themeColor: {
      type: Object,
      default: () => {},
    },
  },

  setup(props, { nextTick }) {
    const searchValue = ref("");
    let fullClassInfoIsShow = ref(false);
    let clickIndex = ref(0);

    const getBackgroundColor = (index) => {
      return simpleLightColor[index % simpleLightColor.length];
    };

    const changeFullClassInfoIsShow = (index) => {
      if (clickIndex.value != index) {
        fullClassInfoIsShow.value = true;
      } else {
        fullClassInfoIsShow.value = fullClassInfoIsShow.value ? false : true;
      }
      clickIndex.value = index;
    };
    const getIsShowAll = (index) =>
      fullClassInfoIsShow.value && clickIndex.value == index;

    let nowYear = ref([]);
    const store = useStore();
    const change = debounce(() => {
      store.commit("exam/setCurrentExamBySearch", {
        searchValue: searchValue.value,
      });
    }, 100);

    const getAllYear = (term) => {
      let termInfo = term.map((item) => {
        return item.term.substr(0, 4);
      });
      return Array.from(new Set(termInfo));
    };

    // 监听 store.state.common.loginIsGraduteStudent 的变化
    const loginIsGraduteStudent = computed(() => store.state.common.loginIsGraduteStudent);

    // 根据 loginIsGraduteStudent 的值计算 grade
    const grade = computed(() => 
      loginIsGraduteStudent.value 
        ? ["研一", "研二", "研三"] 
        : ["大一", "大二", "大三", "大四"]
    );

    // 计算 getTerm 函数
    const getTerm = computed(() => {
      return (term) => {
        let year = term.substr(0, 4);
        let _term = term.substr(4);
        // console.log("getTerm",term);
        if (loginIsGraduteStudent.value) {
          _term = _term.includes("1") ? "上学期" : "下学期";
        } else {
          _term = _term === "01" ? "上学期" : "下学期";
        }
        // console.log("nowYear",nowYear.value);
        const yearIndex = nowYear.value.indexOf(year);
        return yearIndex!== -1 
          ? `${grade.value[yearIndex]}${_term}` 
          : `${year}${_term}`;
      };
    });
    // 监听 nowYear 的变化，确保 getTerm 能响应 nowYear 的更新
    watch(nowYear, () => {
      // 这里不需要额外操作，因为 getTerm 是 computed 属性，会自动更新
    });
    let isRefresh = inject("isRefresh");

    const getIsLogin = computed(() => store.state.common.isLogin);

    watch(
      () => isRefresh.value,
      () => {
        if (isRefresh.value && getIsLogin.value) {
          nowYear.value = getAllYear(props.allExamInfo);
          console.log("nowYear刷新了", nowYear.value);
        }
      }
    );

    onMounted(() => {
      if (getIsLogin) {
        nowYear.value = getAllYear(props.allExamInfo);
      }
    });

    return {
      searchValue,
      change,
      getTerm,
      ...toRefs(props),
      fullClassInfoIsShow,
      changeFullClassInfoIsShow,
      clickIndex,
      getIsShowAll,
      getBackgroundColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.all-exam {
  display: flex;
  flex-direction: column;
  flex-direction: flex-start;
  align-items: center;

  .all-exam-search {
    height: 50px;
  }

  .exam-container {
    .exam-item {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .exam-info-left {
        width: 55%;

        .exam-info-type {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
        }
      }

      .exam-info-right {
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;

        .exam-info-gp {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
      }
    }

    .exam-item-error {
      height: 300px;
      font-size: 30px;

      border-radius: 10px;

      .iconfont {
        font-size: 30px;
      }
    }
  }
}

.class-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>