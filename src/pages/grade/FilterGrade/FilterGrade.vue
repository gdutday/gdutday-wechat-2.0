<template>
  <div>
    <wave-header title="筛选学科"></wave-header>
    <list class="container m-2 p-2">
      <cell
        v-for="(item, index) of examList"
        :key="index"
        class="container-list py-5 px-4 w-1 rounded-2"
        :class="
          isMyMapHas(item.cn)
            ? 'class-cancel animation-shake'
            : 'animation-fade'
        "
        @tap="filerOneExam(item, index)"
      >
        <view>{{ item.cn }}</view>
        <view>{{ item.result }}</view>
      </cell>
    </list>
    <refresh-button type="withoutRefresh"></refresh-button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, watch, ref, reactive, toRefs } from "vue";
import WaveHeader from "@/components/common/WaveHeader";
import RefreshButton from "@/components/common/RefreshButton";
import { getStorageSync } from "@/utils/common";
export default {
  components: { WaveHeader, RefreshButton },

  setup() {
    const store = useStore();

    const isMyMapHas = (key) => state.deleteMap.has(key);

    const EXAM_ARR = getStorageSync("exam"); //获取死的成绩（不允许改变）

    const initExam = () => {
      //获取所有成绩
      //初始化程序不允许任何更改
      let examArr = EXAM_ARR;

      //下方进行简单的处理，把他变成一个可展示的数组
      let keys = Object.keys(examArr);
      let result = [];
      for (let i of keys) {
        result.push(...examArr[i]);
      }

      return result;
    };

    let state = reactive({
      examList: [],
      deleteMap: store.state.exam.deleteMap,
    });

    const curExam = computed(() => {
      return store.state.exam.exam;
    });

    const filerOneExam = (item, index) => {
      let { cn } = item;

      //如果课表没有被删除
      //只能返回已经被删除过了的
      let examArr = curExam.value;
      let keys = Object.keys(examArr);
      let result = {};

      if (isMyMapHas(cn)) {
        let beDeletedClass = state.deleteMap.get(cn);
        let { term } = beDeletedClass;
        examArr[term].push(beDeletedClass);
        state.deleteMap.delete(cn);

        store.commit("exam/setExam", { exam: examArr });
      } else {
        for (let keysOfYear of keys) {
          let resultChild = examArr[keysOfYear].filter((item) => {
            //这个cn就是当前要删除的名字
            if (cn == item.cn) {
              //如果还没有添加过，就不返回
              state.deleteMap.set(cn, item);
              console.log("我要设置这个元素");
            }

            return cn != item.cn;
          });
          result[keysOfYear] = resultChild;
        }
        store.commit("exam/setExam", { exam: result });
      }
      //console.log("result:", result);
      //store.commit("exam/setExam", { exam: result });
      store.commit("exam/setCurrentExam", {
        termIndex: store.state.exam.termIndex,
      });
      store.commit("exam/setDeleteMap", state.deleteMap);
      // console.log("store.exam:", store.state.exam.exam);
      // console.log("deleteMap", store.state.exam.deleteMap);
    };

    watch(
      () => {
        return state.deleteMap.size;
      },
      () => {
        state.examList = initExam();
      },
      {
        immediate: true,
      }
    );

    return {
      isMyMapHas,
      filerOneExam,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .container-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}

.class-cancel {
  text-decoration: line-through;
  background-color: rgb(240, 240, 240);
  color: #000;
}
</style>