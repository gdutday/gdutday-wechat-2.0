<template>
  <ming-modal @close="close(true)" :isShow="isShow">
    <template v-slot:default>
      <view
        class="wkd depth-ming"
        :style="{
          background: `linear-gradient(20deg,${'#fff'} 30%,${
            showedScheduleInfo.id ? getColor(showedScheduleInfo.id) : '#DCDCDC'
          } 70%)`,
        }"
      >
        <view class="wkd-container w-1" v-if="getModalType == ''">
          <view class="wkd-header">
            <view class="wkd-header-class">{{ showedScheduleInfo.cn }}</view>
            <view class="wkd-header-address">
              <text class="iconfont icon-icon-test21 pr-1"></text>
              {{ showedScheduleInfo.ad }}
            </view>
          </view>
          <view class="wkd-info">
            <view class="wkd-info-teacher">
              <text class="iconfont icon-icon-test19 pr-1"></text>
              {{ showedScheduleInfo.tn }}</view
            >
            <view class="wkd-info-time"> <text class="iconfont icon-icon-test5 pr-1"></text>{{ _getClassTime }}</view>
            <view class="wkd-info-classInfo depth-1">
              <scroll-view scroll-y scroll-with-animation :scroll-into-view="scrollCenter" class="scroll-view">
                <view class="wkd-info-classInfo-info">{{ showedScheduleInfo.cc }}</view>
              </scroll-view>
            </view>
          </view>
        </view>
        <!-- 以下部分是二维码part -->
        <QRcode v-else-if="getModalType == 'QRcode'"> </QRcode>
      </view>
    </template>
  </ming-modal>
</template>

<script>
import { computed } from 'vue'
import { useStore, vuex } from 'vuex'
import { getStorageSync, getColor, getClassTime } from '@/utils/common.js'
import { time } from '@/static/time.js'
import QRcode from '@/components/content/schedule/ScheduleContent/MingRefresh/ScheduleExtention/Exetention/QRcode/QRcode'
import MingModal from '@/components/common/MingModal.vue'
import { useMingModal } from '@/hooks/index.js'

export default {
  components: {
    QRcode,
    MingModal,
  },
  props: {
    showedScheduleInfo: {
      type: Object,
      default: () => {},
    },
    bgColor: {
      type: String,
      default: '#000',
    },
  },
  setup(props, { emit }) {
    const { isShow, close, getModalType } = useMingModal()

    const _getClassTime = computed(() =>
      props.showedScheduleInfo.cs ? getClassTime(props.showedScheduleInfo.cs, time) : ''
    )

    return {
      _getClassTime,
      getColor,
      getModalType,
      isShow,
      close,
    }
  },
}
</script>

<style lang="scss" scoped>
.wkd {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  max-width: 350px;
  padding: 35px;
  border-radius: 15rpx;

  .wkd-container {
    display: flex;
    flex-direction: column;

    .wkd-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 40rpx;
      padding-top: 20rpx;

      .wkd-header-class {
        font-size: 30px;
        flex: 1;
      }
      .wkd-header-address {
        min-width: 80px;
        max-width: 80px;
      }
    }

    .wkd-info {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .wkd-info-classInfo {
        height: 120px;

        padding: 20px;
        border-radius: 35rpx;

        .scroll-view {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
</style>
