<template>
  <view class="se w-1" :style="{height: exeHeight + 'px', overflow: 'hidden'}">
    <!-- 公告横幅 -->
    <view class="announcement-bar" :style="{background: `linear-gradient(135deg, ${themeColor.curBgSecond} 0%, ${themeColor.curBgSecond} 100%)`}">
      <view class="announcement-glow" />
      <view class="announcement-content">
        <text class="announcement-tag" :style="{color: themeColor.curBgSecond}">NEW</text>
        <view class="announcement-track">
          <text class="announcement-text">新功能：四六级查询 · 导出课表 ｜ 征集学长学姐资料，传承给每届新生！发布官方通知请联系我们 ｜ 新功能：四六级查询 · 导出课表 ｜ 征集学长学姐资料，传承给每届新生！发布官方通知请联系我们 ｜ </text>
        </view>
      </view>
    </view>

    <view v-for="(item, index) in icons" :key="index" class="exItems">
      <view @tap="open(item.operation)" class="exItems-item">
        <view class="flex-center bg-content depth-3"
          style="height: 35px; width: 35px; border-radius: 50%; margin-bottom: 5rpx">
          <!-- <text :class="'cuIcon-' + item.icon" style="font-size: 30px;"></text> -->
          <image :src="'/static/extension/' + item.icon" style="height: 28px; width: 28px" />
        </view>
        <text class="text-xxs" :class="hasBackground && fontColor ? 'text-white' : ''">
          {{ item.description }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import {useStore} from 'vuex'
import {useMingModal} from '@/hooks/index.js'
export default {
  props: {
    exeHeight: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore()

    const {openModal, changeCloseType} = useMingModal()

    const openWait = () => {
      uni.showToast({
        title: '咕咕咕,在做了...',

        duration: 1500,
      })
    }
    const openWaitFixing = () => {
      uni.showToast({
        title: '维护中...',
        duration: 1500,
      })
    }

    const openTheme = () => {
      uni.navigateTo({
        url: 'Extention/ThemeSet',
      })
    }

    const openExam = () => {
      uni.navigateTo({
        url: 'Extention/openExam',
      })
    }

    const openSpiritedAway = () => {
      uni.navigateTo({
        url: 'Extention/SpiritedAway',
      })
    }

    const openQRCode = () => {
      changeCloseType('QRcode')
      openModal()
    }

    const openNews = () => {
      uni.navigateTo({
        url: 'Extention/SchoolNews',
      })
    }

    const openUpdateStartPage = () => {
      uni.navigateTo({
        url: 'Extention/UpdateStartPage/UpdateStartPage',
      })
    }

    const openExportSchedule = () => {
      uni.navigateTo({
        url: 'Extention/ExportSchedule',
      })
    }

    const openFreeClassroom = () => {
      uni.navigateTo({
        url: 'Extention/FreeClassroom',
      })
    }

    const openCetScore = () => {
      uni.navigateTo({
        url: 'Extention/CetScore',
      })
    }

    const themeColor = store.state.theme

    const open = operation => {
      operation()
    }

    const icons = [
      {
        icon: 'QR.png',
        description: '入馆二维码',
        operation: openQRCode,
      },
      {
        icon: 'book.png',
        description: '主题设置',
        operation: openTheme,
      },
      {
        icon: 'news.png',
        description: '校内新闻',
        operation: openWait,
      },
      {
        icon: 'evaluate.png',
        description: '考试安排',
        operation: openExam,
      },
      // {
      //   icon: "rubbish.png",
      //   description: "垃圾分类查询",
      //   operation: openWait,
      // },
      {
        icon: 'pay.png',
        description: '千与千寻',
        operation: openWait,
      },
      {
        icon: 'file.png',
        description: '资料查找',
        operation: openWait,
      },
      {
        icon: 'map.png',
        description: '上封面',
        operation: openWait,
      },
      {
        icon: 'classroom.png',
        description: '空教室查询',
        operation: openFreeClassroom,
      },
      {
        icon: 'export.svg',
        description: '导出课表',
        operation: openExportSchedule,
      },
      {
        icon: 'cet.svg',
        description: '四六级查询',
        operation: openCetScore,
      },
    ]

    return {
      icons,
      open,
      themeColor,
    }
  },
}
</script>

<style lang="scss" scoped>
.se {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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

.announcement-bar {
  width: calc(100% - 40rpx);
  margin: 8rpx 20rpx 16rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.announcement-glow {
  position: absolute;
  top: -50%;
  left: -60%;
  width: 60%;
  height: 200%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  animation: shimmer 3s ease-in-out infinite;
  transform: skewX(-20deg);
}

@keyframes shimmer {
  0% {
    left: -60%;
  }
  100% {
    left: 120%;
  }
}

.announcement-content {
  display: flex;
  align-items: center;
  padding: 12rpx 16rpx;
  position: relative;
  z-index: 1;
}

.announcement-tag {
  flex-shrink: 0;
  font-size: 18rpx;
  font-weight: bold;
  background: #fff;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
  letter-spacing: 1rpx;
}

.announcement-track {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}

.announcement-text {
  display: inline-block;
  font-size: 22rpx;
  color: #fff;
  font-weight: 500;
  animation: marquee 22s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
