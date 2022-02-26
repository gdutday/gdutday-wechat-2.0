<template>
  <view class="h-1 w-1 mw-info" :style="{ backgroundColor: getThemeColor }">
    <view class="mw-version flex-center">
      <text data-text="GDUTDAY 2.0.0" class="web-font fw-05"
        >GDUTDAY 2.0.0</text
      >
    </view>
    <view class="mw-examwarning pb-3"
      ><slot>
        <view class="w-1">
          <text v-if="isGetNearestExamIs"
            ><text class="iconfont icon-icon-test30 pr-1"></text
            >{{ getNearestExam }}</text
          >
          <text v-else>近期没有考试，上号！</text>
        </view></slot
      ></view
    >
  </view>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  setup() {
    const store = useStore();
    const getThemeColor = computed(() => {
      return store.state.theme.curBg;
    });
    console.log("---------");
    console.log(store.state.exam);
    console.log("---------");
    const getNearestExam = computed(() => {
      console.log(store.state.exam.nearestExam);
      return `您距离最近的考试: ${store.state.exam.nearestExam.name} 还有${store.state.exam.nearestExam.countDown}天`;
    });

    const isGetNearestExamIs = computed(() => {
      if (store.state.exam.nearestExam.name) {
        return true;
      } else {
        return false;
      }
    });

    return {
      getThemeColor,
      getNearestExam,
      isGetNearestExamIs,
    };
  },
};
</script>

<style lang="scss" scoped>
.mw-info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  position: relative;
  min-height: 100%;
  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    min-width: 185%;
    min-height: 400%;
    background: linear-gradient(#90cad5, #fce1c2);
    animation: rotate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  &:before {
    top: 60%;
    border-radius: 45%;
    animation-duration: 7s;
  }

  &:after {
    top: 55%;
    opacity: 0.5;
    border-radius: 47%;
    animation-duration: 7s;
  }

  .mw-version {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    text {
      position: relative;
      font-size: 2.5rem;
      word-spacing: 0.2em;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      color: transparent;
      background-color: #000;
      background-clip: text;
    }

    text::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 5;
      background-image: linear-gradient(
        120deg,
        transparent 0%,
        transparent 6rem,
        white 11rem,
        transparent 11.15rem,
        transparent 15rem,
        rgba(255, 255, 255, 0.3) 20rem,
        transparent 25rem,
        transparent 27rem,
        rgba(255, 255, 255, 0.6) 32rem,
        white 33rem,
        rgba(255, 255, 255, 0.3) 33.15rem,
        transparent 38rem,
        transparent 40rem,
        rgba(255, 255, 255, 0.3) 45rem,
        transparent 50rem,
        transparent 100%
      );
      background-clip: text;
      background-size: 250% 180%;
      background-repeat: no-repeat;
      animation: shine 10s infinite linear;
    }
  }

  .mw-examwarning {
    border-bottom: 3px solid #ccc;
    text-align: center;
    flex: 1;
    z-index: 99;
  }
}
</style>