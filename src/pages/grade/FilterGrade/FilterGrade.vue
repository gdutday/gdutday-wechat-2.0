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
        <view>{{ item.cn  }}</view>
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
    let state = reactive({
      examList: [],
      deleteMap: store.state.exam.deleteMap,
    });
    const isMyMapHas = (key) => state.deleteMap.has(key);

    const EXAM_ARR = getStorageSync("exam"); //获取死的成绩（不允许改变）
    console.log(state.deleteMap);
    console.log(112211);
    
    
    const initExam = () => {
      //获取所有成绩
      //初始化程序不允许任何更改
      let classId = 0
      let examArr = EXAM_ARR;

      //下方进行简单的处理，把他变成一个可展示的数组
      let keys = Object.keys(examArr);
      let result = [];
      for (let i of keys) {
        result.push(...examArr[i]);        
      }
    
      console.log(result)

      return result;
    };

    const curExam = computed(() => {
      return store.state.exam.exam;
    });

const filerOneExam = (item, index) => {
  let { id, cn } = item;  // 同时解构 id 和 cn

  let examArr = curExam.value;
  let keys = Object.keys(examArr);
  let result = {};

  function foo(id, cn) {  // 修改函数参数
    if (isMyMapHas(cn)) {  // 使用 cn 检查
      let beDeletedClass = state.deleteMap.get(cn);  // 使用 cn 获取
      let { term } = beDeletedClass;
      examArr[term].push(beDeletedClass);
      state.deleteMap.delete(cn);  // 使用 cn 删除

      store.commit("exam/setExam", { exam: examArr });
    } else {
      for (let keysOfYear of keys) {
        let resultChild = examArr[keysOfYear].filter((item) => {
          if (id === item['id']) {  // 仍然使用 id 匹配课程
            state.deleteMap.set(cn, item);  // 使用 cn 作为 key
            console.log("设置元素:", cn);
          }
          return id !== item['id'];
        });
        result[keysOfYear] = resultChild;
      }
      store.commit("exam/setExam", { exam: result });
    }

    store.commit("exam/setCurrentExam", {
      termIndex: store.state.exam.termIndex,
    });
    store.commit("exam/setDeleteMap", state.deleteMap);
  }

  foo(id, cn)  // 传入both id和cn
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