<template>
  <view class="all-exam py-2 w-1">
    <view class="all-exam-search w-1">
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
    <view class="exam-container py-2 w-1" v-if="allExamInfo.length">
      <view
        class="exam-item depth-1 p-3 mt-4 animation-slide-left"
        v-for="item of allExamInfo"
        :key="item.cn"
      >
        <view class="exam-info-left">
          <text class="title-font web-font fw-05">{{ item.cn }}</text>
          <view class="exam-info-type text-dark my-2">
            <text>{{ item.type }}</text>
            <text v-if="item.cType">{{ item.cType }}</text>
          </view>
          <view>
            {{ getTerm(item.term) }}
          </view>
        </view>
        <view class="exam-info-right">
          <text>
            <text class="title-font web-font">{{ item.result }}</text></text
          >
          <view class="exam-info-gp text-dark">
            <text>我的绩点:{{ item.gp }}</text>
            <text>所占学分:{{ item.credit }}</text>
          </view>
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
//import { classColor } from "@/static/color/color.js";
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
    let nowYear = ref([]);
    const store = useStore();
    let refreshStatus = false;
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

    const getTerm = computed(() => {
      //console.log(props.allExamInfo);
      const grade = ["大一", "大二", "大三", "大四"];
      console.log(nowYear);
      return (term) => {
        let year = term.substr(0, 4);
        let _term = term.substr(4);
        _term == "01" ? (_term = "上学期") : (_term = "下学期");

        return `${grade[nowYear.value.indexOf(year)]}${_term}`;
      };
    });

    console.log(props.allExamInfo);
    console.log("00000000000000");
    let isRefresh = inject("isRefresh");
    console.log(isRefresh);
    console.log(111);
    const getIsLogin = computed(() => store.state.common.isLogin);
    watch(
      () => isRefresh.value,
      () => {
        console.log(isRefresh);
        console.log(111);
        if (refreshStatus) return;
        if (isRefresh.value && getIsLogin.value) {
          console.log("我被触发了");
          nowYear.value = getAllYear(props.allExamInfo);
          refreshStatus = true;
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
      border-radius: 10px;
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
</style>