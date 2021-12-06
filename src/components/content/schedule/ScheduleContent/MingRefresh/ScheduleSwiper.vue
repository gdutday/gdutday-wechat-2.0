<template>
  <view class="w-1 h-1">
    <swiper
      class="w-1 h-1 swiper"
      @change="change($event)"
      :indicator-dots="false"
      :duration="500"
      circular
    >
      <swiper-item class="w-1 h-1" v-for="(item, index) of 3" :key="index">
        <week-content :weekContent="getpickWeekSchedule[index]"></week-content>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import WeekContent from "@/components/content/schedule/ScheduleContent/MingRefresh/Week/WeekContent.vue";
import { getStorageSync } from "@/utils/common.js";

export default {
  components: {
    WeekContent,
  },
  setup() {
    const store = useStore();
    let getPickWeek = computed(() => {
      return store.state.scheduleInfo.pickWeek;
    });
    let getCurrentWeek = computed(() => {
      return store.state.scheduleInfo.currentWeek;
    });
    let getpickWeekSchedule = computed(() => {
      return store.state.scheduleInfo.pickWeekSchedule;
    });
    // 引入所有课程表
    let weeksData = computed(() => {
      return store.state.scheduleInfo.schedule;
    });
    console.log("--------------------");
    console.log(store.state.scheduleInfo);
    console.log("--------------------");
    // 传到三个组件的课程表
    let swiperList = ref([]);
    swiperList.value = [
      weeksData.value[getPickWeek.value],
      weeksData.value[getPickWeek.value + 1],
      weeksData.value[getPickWeek.value - 1],
    ];

    //在此处完成初始化
    store.commit("scheduleInfo/setPickWeekSchedule", {
      pickWeekSchedule: swiperList.value,
    });

    let indexBefore = ref(0);
    // indexBefore用于保存前一次翻滚的翻滚状态

    const change = (event) => {
      //console.log(event);
      //从vuex里获得的当前选择的周数

      //目前获得的index
      let currentIndex = event.detail.current;
      const swiperListLen = swiperList.value.length;
      if (
        (!(currentIndex == 2 && !indexBefore.value) &&
          currentIndex > indexBefore.value) ||
        (!currentIndex && indexBefore.value == swiperListLen - 1)
      ) {
        // console.log(swiperList.value.length);
        // console.log("上一个状态的index:" + indexBefore.value);
        // console.log("目前的的index:" + currentIndex);
        let tempIndex = indexBefore.value;
        console.log("加前" + getPickWeek.value);
        //下一段用于动态地更改周数，通过swiper的切换
        // index<19 即 index = 18的时候在下面加1,即index=19,然后再+1，所以说的是20周
        if (getPickWeek.value < 19) {
          store.commit("scheduleInfo/setPickWeek", {
            pickWeek: getPickWeek.value + 1,
          });
        } else {
          store.commit("scheduleInfo/setPickWeek", {
            pickWeek: 0,
          });
        }
        //下面一段是swiper切换的逻辑
        if (currentIndex > indexBefore.value) {
          console.log("正常后翻");
          indexBefore.value = currentIndex;
          //swiperList.value = [weeksData];
        } else {
          console.log("最后一页后翻");
          indexBefore.value = 0;
        }
        //到这一步，我们已经实现了+1了
        //console.log("加后" + getPickWeek.value);
        // 仍然是Index，比如我们现在的getPickWeek.value为0,其实目前在页面上显示的是1
        // 在这一行上面，我们实现了切换页面时的index设定
        //console.log("上一个状态的index:" + tempIndex);
        //console.log("currentIndex目前的的index:" + currentIndex);
        //weeksData也是以index为周的单位

        swiperList.value[currentIndex] = weeksData.value[getPickWeek.value];

        //需要三处逻辑判断，这三处需要自己甄别
        if (getPickWeek.value == 19) {
          swiperList.value[3 - tempIndex - currentIndex] = weeksData.value[0];
          swiperList.value[tempIndex] = weeksData.value[getPickWeek.value - 1];
        } else if (getPickWeek.value == 0) {
          swiperList.value[tempIndex] = weeksData.value[19];
          swiperList.value[3 - tempIndex - currentIndex] =
            weeksData.value[getPickWeek.value + 1];
        } else {
          swiperList.value[3 - tempIndex - currentIndex] =
            weeksData.value[getPickWeek.value + 1];
          swiperList.value[tempIndex] = weeksData.value[getPickWeek.value - 1];
        }
        store.commit("scheduleInfo/setIndex", {
          currentIndex: currentIndex,
          beforeIndex: tempIndex,
        });
      } else {
        let tempIndextwo = indexBefore.value;

        //用于判断周数
        if (getPickWeek.value > 0) {
          store.commit("scheduleInfo/setPickWeek", {
            pickWeek: getPickWeek.value - 1,
          });
        } else {
          store.commit("scheduleInfo/setPickWeek", {
            pickWeek: 19,
          });
        }
        if (currentIndex < indexBefore.value) {
          console.log("正常前翻");
          indexBefore.value = currentIndex;
        } else {
          console.log("第一页前翻");
          indexBefore.value = swiperListLen - 1;
        }

        swiperList.value[currentIndex] = weeksData.value[getPickWeek.value];

        //需要三处逻辑判断，这三处需要自己甄别
        if (getPickWeek.value == 0) {
          swiperList.value[3 - tempIndextwo - currentIndex] =
            weeksData.value[19];
          swiperList.value[tempIndextwo] =
            weeksData.value[getPickWeek.value + 1];
        } else if (getPickWeek.value == 19) {
          swiperList.value[tempIndextwo] = weeksData.value[0];
          swiperList.value[3 - tempIndextwo - currentIndex] =
            weeksData.value[getPickWeek.value - 1];
        } else {
          swiperList.value[3 - tempIndextwo - currentIndex] =
            weeksData.value[getPickWeek.value - 1];
          swiperList.value[tempIndextwo] =
            weeksData.value[getPickWeek.value + 1];
        }

        store.commit("scheduleInfo/setIndex", {
          currentIndex: currentIndex,
          beforeIndex: tempIndextwo,
        });
      }
      //在这里将更新好的课表上传
      store.commit("scheduleInfo/setPickWeekSchedule", {
        pickWeekSchedule: swiperList.value,
      });

      console.log("-----------------------------");
      console.log("-----------------------------");
      console.log("getPickWeek.value当前选择的周的index" + getPickWeek.value);
      console.log(swiperList.value);
      console.log("当前页面是第" + swiperList.value[currentIndex][7] + "周");
      console.log("-----------------------------");
    };

    return {
      getCurrentWeek,
      change,
      swiperList,
      getpickWeekSchedule,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>