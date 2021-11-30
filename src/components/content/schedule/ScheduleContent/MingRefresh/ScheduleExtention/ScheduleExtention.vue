<template>
  <view
    class="se w-1"
    :style="{ height: exeHeight + 'px', overflow: 'hidden' }"
  >
    <view v-for="(item, index) in icons" :key="index" class="exItems">
      <view @tap="open(item.operation)" class="exItems-item">
        <view
          class="flex-center bg-content depth-3"
          style="
            height: 40px;
            width: 40px;
            border-radius: 50%;
            margin-bottom: 5rpx;
          "
        >
          <!-- <text :class="'cuIcon-' + item.icon" style="font-size: 30px;"></text> -->
          <image
            :src="'/static/extension/' + item.icon + '.png'"
            style="height: 28px; width: 28px"
          />
        </view>
        <text
          class="text-xxs"
          :class="hasBackground && fontColor ? 'text-white' : ''"
        >
          {{ item.description }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    exeHeight: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const openWait = () => {
      uni.showToast({
        title: "咕咕咕,在做了...",

        duration: 1500,
      });
      console.log(111);
    };
    const openWaitFixing = () => {
      uni.showToast({
        title: "维护中...",
        duration: 1500,
      });
    };

    const openTheme = () => {
      uni.navigateTo({
        url: "Extention/ThemeSet",
      });
    };

    const openExam = () => {
      uni.navigateTo({
        url: "Extention/OpenExam",
      });
    };

    const open = (operation) => {
      operation();
    };

    const icons = [
      {
        icon: "QR",
        description: "入馆二维码",
        operation: openWait,
      },
      {
        icon: "book",
        description: "主题设置",
        operation: openTheme,
      },
      {
        icon: "news",
        description: "校内新闻",
        operation: openWait,
      },
      {
        icon: "rubbish",
        description: "垃圾分类查询",
        operation: openWait,
      },
      {
        icon: "pay",
        description: "校园网缴费",
        //operation: this.openPay,
        operation: openWait,
      },
      {
        icon: "file",
        description: "资料查找",
        operation: openWait,
      },
      {
        icon: "map",
        description: "校园导览",
        operation: openWait,
      },
      {
        icon: "classroom",
        description: "空教室查询",
        operation: openWaitFixing,
      },
      {
        icon: "evaluate",
        description: "考试安排",
        operation: openExam,
      },
    ];

    return {
      icons,
      open,
    };
  },
};
</script>

<style lang="scss" scoped>
.se {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;

  .exItems {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;

    .exItems-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>