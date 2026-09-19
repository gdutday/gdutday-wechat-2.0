<template>
  <ming-modal @close="close(true)" :isShow="isShow">
    <template v-slot:default>
      <view
        class="wkd depth-ming"
        :class="{ 'wkd--editing': keyboardUp }"
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
              {{ showedScheduleInfo.tn ? showedScheduleInfo.tn : '自定义的课程不加老师咯' }}</view
            >
            <view class="wkd-info-time"> <text class="iconfont icon-icon-test5 pr-1"></text>{{ _getClassTime }}</view>
            <view class="wkd-info-classInfo depth-1">
              <scroll-view scroll-y scroll-with-animation :scroll-into-view="scrollCenter" class="scroll-view">
                <view class="wkd-info-classInfo-info">{{ showedScheduleInfo.cc }}</view>
              </scroll-view>
            </view>

            <!-- 内嵌备注区域 -->
            <view class="wkd-remark-section">
              <view v-if="latestNote" class="wkd-remark-preview">
                <text class="wkd-remark-preview__label">最新备注：</text>
                <text class="wkd-remark-preview__content">{{ latestNote.content.slice(0, 60) }}{{ latestNote.content.length > 60 ? '...' : '' }}</text>
              </view>
              <view class="wkd-remark-quick">
                <view v-if="!showQuickInput" class="wkd-remark-quick__trigger" @click.stop="showQuickInput = true">
                  <text class="wkd-remark-quick__placeholder">快速记一条...</text>
                </view>
                <view v-else class="wkd-remark-quick__editor" @click.stop>
                  <textarea
                    class="wkd-remark-quick__textarea"
                    v-model="quickInputContent"
                    placeholder="写点什么..."
                    :maxlength="500"
                    :focus="true"
                    :auto-height="true"
                    :adjust-position="false"
                    :style="{ minHeight: '80rpx', maxHeight: '200rpx' }"
                    @keyboardheightchange="onKeyboardHeight"
                  ></textarea>
                  <view class="wkd-remark-quick__btns">
                    <text class="wkd-remark-quick__cancel" @click.stop="showQuickInput = false">取消</text>
                    <text class="wkd-remark-quick__save" @click.stop="handleQuickSave">保存</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="wkd-info-remark" @click.stop="goToRemarkDetail">
              查看全部备注{{ remarkCount ? ` (${remarkCount}条)` : '' }} 〉
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
import { computed, ref, watch } from 'vue'
import { useStore, vuex } from 'vuex'
import { getStorageSync, getColor, getClassTime } from '@/utils/common.js'
import {
  createCourseRemarkKey,
  createCourseTimeGroupKey,
  getCourseRemark,
  quickAddNote,
} from '@/utils/courseRemark.js'
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

    const showQuickInput = ref(false)
    const quickInputContent = ref('')
    const remarkVersion = ref(0)
    const keyboardUp = ref(false)

    const onKeyboardHeight = (e) => {
      keyboardUp.value = (e.detail?.height || 0) > 0
    }

    const _getClassTime = computed(() =>
      props.showedScheduleInfo.cs ? getClassTime(props.showedScheduleInfo.cs, time) : ''
    )

    const courseKey = computed(() => createCourseRemarkKey(props.showedScheduleInfo))
    const timeGroupKey = computed(() => createCourseTimeGroupKey(props.showedScheduleInfo))

    const currentRemark = computed(() => {
      remarkVersion.value // reactive dependency
      return getCourseRemark(courseKey.value)
    })

    const currentTimeGroup = computed(() => {
      if (!currentRemark.value) return null
      return (currentRemark.value.timeGroups || []).find(
        tg => tg.timeGroupKey === timeGroupKey.value
      )
    })

    const latestNote = computed(() => {
      const notes = currentTimeGroup.value?.notes || []
      if (!notes.length) return null
      return notes[notes.length - 1]
    })

    const remarkCount = computed(() => {
      return (currentRemark.value?.timeGroups || []).reduce(
        (total, tg) => total + (tg.notes?.length || 0), 0
      )
    })

    // Reset quick input when modal closes
    watch(isShow, (val) => {
      if (!val) {
        showQuickInput.value = false
        quickInputContent.value = ''
      }
    })

    const handleQuickSave = () => {
      if (!quickInputContent.value.trim()) {
        uni.showToast({ title: '请输入内容', icon: 'none' })
        return
      }

      const success = quickAddNote(courseKey.value, timeGroupKey.value, quickInputContent.value)
      if (success) {
        uni.showToast({ title: '保存成功', icon: 'success' })
        quickInputContent.value = ''
        showQuickInput.value = false
        remarkVersion.value++
      } else {
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    }

    const goToRemarkDetail = () => {
      const course = props.showedScheduleInfo
      if (!course) return

      uni.navigateTo({
        url: `/pages/remark/RemarkDetail?courseKey=${encodeURIComponent(courseKey.value)}&timeGroupKey=${encodeURIComponent(timeGroupKey.value)}`,
        success: () => {
          close(true)
        }
      })
    }

    return {
      _getClassTime,
      getColor,
      getModalType,
      isShow,
      close,
      goToRemarkDetail,
      // Inline remark
      showQuickInput,
      quickInputContent,
      latestNote,
      remarkCount,
      handleQuickSave,
      keyboardUp,
      onKeyboardHeight,
    }
  },
}
</script>

<style lang="scss" scoped>
.wkd {
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translate(-50%, 0) translateY(calc(50vh - 50% - 2%));
  width: 75%;
  max-width: 350px;
  padding: 35px;
  border-radius: 15rpx;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;

  &--editing {
    transform: translate(-50%, 0);
  }

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
      min-height: 200px;
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

      .wkd-remark-section {
        margin-top: 20rpx;
      }

      .wkd-remark-preview {
        padding: 16rpx 20rpx;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 12rpx;
        margin-bottom: 12rpx;
      }

      .wkd-remark-preview__label {
        font-size: 22rpx;
        color: #6b7280;
        display: block;
        margin-bottom: 4rpx;
      }

      .wkd-remark-preview__content {
        font-size: 24rpx;
        color: #374151;
        line-height: 1.5;
        word-break: break-all;
      }

      .wkd-remark-quick__trigger {
        padding: 16rpx 20rpx;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 12rpx;
        border: 1px dashed #d1d5db;
      }

      .wkd-remark-quick__placeholder {
        font-size: 24rpx;
        color: #9ca3af;
      }

      .wkd-remark-quick__editor {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 12rpx;
        padding: 16rpx;
      }

      .wkd-remark-quick__textarea {
        width: 100%;
        font-size: 24rpx;
        line-height: 1.6;
        box-sizing: border-box;
      }

      .wkd-remark-quick__btns {
        display: flex;
        justify-content: flex-end;
        gap: 20rpx;
        margin-top: 12rpx;
      }

      .wkd-remark-quick__cancel {
        font-size: 24rpx;
        color: #6b7280;
        padding: 8rpx 20rpx;
      }

      .wkd-remark-quick__save {
        font-size: 24rpx;
        color: #fff;
        background: #111827;
        padding: 8rpx 24rpx;
        border-radius: 999rpx;
      }

      .wkd-info-remark {
        text-align: right;
        font-size: 26rpx;
        color: #666;
        font-weight: 500;
        margin-top: 16rpx;
        margin-right: 10rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
