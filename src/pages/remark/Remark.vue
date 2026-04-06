<template>
  <view>
    <Ztl>
      <template v-slot:navBack>
        <view>{{}}</view>
      </template>
      <template v-slot:navName>
        <view>提醒</view>
      </template>
    </Ztl>
    <view class="w-1 p-3">
      <!-- 炫酷许愿池公告条 -->
      <view class="wish-notice depth-1" :class="{ 'is-expanded': showWishPool }">
        <view class="wish-notice__bg-anim"></view>
        <view class="wish-notice__main">
          <view class="wish-notice__header" @click="showWishPool = !showWishPool">
            <text class="wish-notice__icon">🌟</text>
            <view class="wish-notice__marquee">
              <view class="wish-notice__marquee-text">Gdutdays功能许愿池正式开启！点击许愿...</view>
            </view>
            <view class="wish-notice__arrow" :class="{ 'is-rotated': showWishPool }">▼</view>
          </view>
          <view class="wish-notice__content">
            <view class="wish-notice__desc">
              想要什么新功能？长按下方专属链接复制，到小红书评论区留下你的心愿，让我们为你实现！
            </view>
            <view class="wish-notice__action">
              <text class="wish-notice__link" user-select="true" selectable="true">http://xhslink.com/o/4gVS7gqUIsY</text>
            </view>
          </view>
        </view>
      </view>

      <ming-container>
        <template v-slot:title>
          <text>课程备注</text>
        </template>
        <template v-slot:desc>
          <text>
            先按课程分类查看，再进入课程内按不同上课时间管理备注卡片。
            <text class="remark-page-desc__link" @tap="scrollToBackup">「备份与恢复」</text>
          </text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            <view v-if="courseList.length" class="w-1">
              <view
                v-for="item in courseList"
                :key="item.courseKey"
                class="remark-course-item w-1"
                @tap="openDetail(item)"
              >
                <view class="remark-course-item__main">
                  <view class="remark-course-item__header">
                    <text class="remark-course-item__title">{{ item.cn }}</text>
                    <text
                      class="remark-course-item__tag"
                      :style="{
                        backgroundColor: item.remarkCount ? getThemeColor.curBg : '#F3F4F6',
                        color: item.remarkCount ? getThemeColor.curTextC : '#6B7280',
                      }"
                    >
                      {{ item.remarkCount ? `${item.remarkCount}条备注` : '未备注' }}
                    </text>
                  </view>
                  <view class="remark-course-item__meta text-dark" v-if="item.tn">
                    <text>教师：{{ item.tn }}</text>
                  </view>
                  <view class="remark-course-item__meta text-dark">
                    <text>共 {{ item.timeGroupCount }} 个上课时间</text>
                    <text v-if="item.firstGroupText">{{ item.firstGroupText }}</text>
                  </view>
                  <view class="remark-course-item__summary" v-if="item.previewRemark">
                    {{ item.previewRemark }}
                  </view>
                </view>
                <text class="remark-course-item__arrow text-dark">&gt;</text>
              </view>
            </view>
            <view v-else class="remark-empty text-dark">
              暂无课程数据，请先刷新课表。
            </view>

            <view class="remark-backup-divider"></view>
            <view id="remark-backup-section" class="remark-backup depth-1">
              <view class="remark-backup__header">
                <view>
                  <view class="remark-backup__title">数据备份与恢复</view>
                  <view class="remark-backup__subtitle text-dark">支持导出本地备注备份文件，或从备份文件恢复数据。</view>
                </view>
              </view>
              <view class="remark-backup__actions">
                <text class="remark-backup__btn remark-backup__btn--primary" @tap="handleExportRemark">导出备份</text>
                <text class="remark-backup__btn remark-backup__btn--secondary" @tap="handleImportRemark">导入恢复</text>
              </view>
              <view class="remark-backup__desc text-dark">
                出于隐私保护考虑，课程备注数据仅保存在当前设备本地，不会自动上传至云端。请注意，若卸载或删除小程序，本地备注数据将无法保留，建议您根据需要及时导出备份文件自行留存。
              </view>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer.vue'
import {
  createCourseRemarkPreview,
  exportRemarkData,
  getCourseRemarkCount,
  importRemarkData,
  mergeRemarkCourseList,
} from '@/utils/courseRemark'

export default {
  components: {
    Ztl,
    MingContainer,
  },
  setup() {
    const store = useStore()
    const mergedCourseList = ref([])
    const showWishPool = ref(false)

    const getThemeColor = computed(() => store.state.theme)

    const courseList = computed(() => {
      return mergedCourseList.value.map(course => {
        const firstGroup = course.timeGroups[0]
        return {
          ...course,
          remarkCount: getCourseRemarkCount(course),
          previewRemark: createCourseRemarkPreview(course),
          timeGroupCount: course.timeGroups.length,
          firstGroupText: firstGroup ? `${firstGroup.weekdayText} ${firstGroup.timeText}` : '',
        }
      })
    })

    const loadCourseList = () => {
      const storeSchedule = store.state.scheduleInfo.schedule
      const schedule = (Array.isArray(storeSchedule) && storeSchedule.length ? storeSchedule : uni.getStorageSync('weeksData')) || []
      mergedCourseList.value = mergeRemarkCourseList(schedule)
    }

    const openDetail = course => {
      uni.navigateTo({
        url: `/pages/remark/RemarkDetail?courseKey=${encodeURIComponent(course.courseKey)}`,
      })
    }

    const scrollToBackup = () => {
      uni.createSelectorQuery()
        .select('#remark-backup-section')
        .boundingClientRect(data => {
          if (!data) return
          uni.pageScrollTo({
            scrollTop: data.top,
            duration: 300,
          })
        })
        .exec()
    }

    const handleExportRemark = () => {
      exportRemarkData()
        .then(() => {
          uni.showToast({ title: '请在微信里选择保存或转发', icon: 'none' })
        })
        .catch(e => {
          console.error(e)
          uni.showToast({ title: e.message || '导出失败', icon: 'none' })
        })
    }

    const handleImportRemark = () => {
      importRemarkData()
        .then(() => {
          loadCourseList()
        })
        .catch(e => {
          console.error(e)
          if (e?.errMsg?.includes('cancel')) return
          uni.showToast({ title: e.message || '导入失败', icon: 'none' })
        })
    }

    onShow(() => {
      loadCourseList()
    })

    return {
      showWishPool,
      courseList,
      getThemeColor,
      openDetail,
      scrollToBackup,
      handleExportRemark,
      handleImportRemark,
    }
  },
}
</script>

<style lang="scss" scoped>
.wish-notice {
  position: relative;
  margin-bottom: 24rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #FFE2E2 0%, #E6E6FA 100%);
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(230, 230, 250, 0.6);
  transition: all 0.3s ease;
}

.wish-notice__bg-anim {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: shine 4s infinite linear;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-50%) rotate(30deg); }
  20% { transform: translateX(100%) rotate(30deg); }
  100% { transform: translateX(100%) rotate(30deg); }
}

.wish-notice__main {
  position: relative;
  padding: 20rpx 24rpx;
  z-index: 1;
}

.wish-notice__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wish-notice__icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4rpx); }
}

.wish-notice__marquee {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}

.wish-notice__marquee-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #5D3FD3;
  text-overflow: ellipsis;
  overflow: hidden;
  /* 如果需要真正的滚动条效果，可以取消注释下面两行 */
  /* display: inline-block; */
  /* animation: textScroll 8s linear infinite; */
}

@keyframes textScroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.wish-notice__arrow {
  font-size: 20rpx;
  color: #5D3FD3;
  margin-left: 16rpx;
  transition: transform 0.3s ease;
}

.wish-notice__arrow.is-rotated {
  transform: rotate(180deg);
}

.wish-notice__content {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease;
}

.wish-notice.is-expanded .wish-notice__content {
  max-height: 300rpx;
  opacity: 1;
  margin-top: 16rpx;
}

.wish-notice__desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16rpx;
}

.wish-notice__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.6);
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
}

.wish-notice__link {
  font-size: 24rpx;
  color: #5D3FD3;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wish-notice__btn {
  font-size: 22rpx;
  font-weight: bold;
  color: #fff;
  background: #5D3FD3;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 8rpx rgba(93, 63, 211, 0.3);
}

.remark-page-desc__link {
  color: #2563eb;
}

.remark-backup-divider {
  height: 1px;
  margin: 36rpx 0 28rpx;
  background: linear-gradient(90deg, rgba(209, 213, 219, 0) 0%, #d1d5db 18%, #d1d5db 82%, rgba(209, 213, 219, 0) 100%);
}

.remark-backup {
  margin-top: 0;
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #eef2f7;
}

.remark-backup__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.remark-backup__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #111827;
}

.remark-backup__subtitle {
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.6;
}

.remark-backup__actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.remark-backup__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 152rpx;
  height: 64rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.remark-backup__btn--primary {
  background: #111827;
  color: #fff;
}

.remark-backup__btn--secondary {
  background: #eef2f7;
  color: #111827;
}

.remark-backup__desc {
  margin-top: 18rpx;
  font-size: 23rpx;
  line-height: 1.8;
}

.remark-course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    flex: 1;
    min-width: 0;
  }

  &__tag {
    flex-shrink: 0;
    font-size: 22rpx;
    padding: 8rpx 16rpx;
    border-radius: 999rpx;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 12rpx;
    font-size: 24rpx;
  }

  &__summary {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #4b5563;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  &__arrow {
    margin-left: 16rpx;
    font-size: 32rpx;
  }
}

.remark-empty {
  padding: 48rpx 0 12rpx;
  text-align: center;
  font-size: 26rpx;
}
</style>
