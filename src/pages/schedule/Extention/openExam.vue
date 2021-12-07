<template>
  <view>
    <Ztl>
      <template v-slot:navName>
        <div>考试安排</div>
      </template>
    </Ztl>
    <view class="exam-container w-1 p-3">
      <view
        v-for="(item, index) of data"
        :key="index"
        class="exam-item coloum-container w-1 depth-4"
        :style="{
          background: `linear-gradient(360deg,${'#fff'} 50%,${getColor(
            item.id
          )} 50%)`,
          borderLeft: `${getThemeColor.curBg} 6px solid`,
        }"
      >
        <view class="w-1 exam-date">
          <text>{{ getDate(item.date) }}</text>
          <text>{{ item.time }}</text></view
        >
        <view class="exam-class py-3 flex-center fw-2"
          ><text> {{ item.clazzName }}</text></view
        >
        <view
          ><text> {{ item.address }}</text></view
        >
        <view class="text-dark"
          ><text> {{ item.campus }}</text></view
        >
        <view class="otherinfo text-dark">
          <text>{{ item.sort }}</text>
          <text class="borderofinfo"> | </text>
          <text>{{ item.type }}</text>
        </view>
        <view class="countdown flex-center">
          <text class="text-dark" v-if="getCountDown(item.date) >= 0">{{
            getCountDown(item.date)
          }}</text>
          <text class="text-dark" v-else>G</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Ztl from "@/components/common/Ztl.vue";
import { getStorageSync, getColor } from "@/utils/common.js";
export default {
  components: {
    Ztl,
  },
  setup() {
    const store = useStore();
    let data = ref([]);

    const getDate = computed(() => {
      return (date) => {
        let newDate = new Date(date);

        return `${newDate.getMonth() + 1}.${newDate.getDate()}`;
      };
    });

    const getCountDown = computed(() => {
      return (date) => {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1;
        let _date = nowDate.getDate();
        if (getStorageSync("platform") == "ios") {
          return parseInt(
            (+new Date(date) - +new Date(`${year}/${month}/${_date}`)) /
              1000 /
              60 /
              60 /
              24
          );
        } else {
          return parseInt(
            (+new Date(date) - +new Date(`${year}-${month}-${_date}`)) /
              1000 /
              60 /
              60 /
              24
          );
        }
      };
    });

    const getThemeColor = computed(() => {
      return store.state.theme;
    });

    onMounted(() => {
      data.value = getStorageSync("futureExam");
    });

    return { data, getDate, getThemeColor, getColor, getCountDown };
  },
};
</script>

<style lang="scss" scoped>
.exam-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  .exam-item {
    position: relative;
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 200px;
    border-radius: 15px;

    .exam-date {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      align-items: center;
      color: #f17251;
      font-size: 16px;

      text {
        margin-right: 10px;
      }
    }

    .exam-class {
      font-size: 28px;
      max-width: 100%;
      text {
        overflow: hidden;

        text-overflow: ellipsis;

        white-space: nowrap;
      }
    }

    .otherinfo {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    .countdown {
      position: absolute;
      right: 12px;
      bottom: -20px;
      font-size: 160px;
      z-index: -1;
    }
  }

  .borderofinfo {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>