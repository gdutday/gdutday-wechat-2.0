<template>
  <view class="remark-page">
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
            <text class="wish-notice__icon">*</text>
            <view class="wish-notice__marquee">
              <view class="wish-notice__marquee-text">Gdutdays功能许愿池正式开启！点击许愿...</view>
            </view>
            <view class="wish-notice__arrow" :class="{ 'is-rotated': showWishPool }">v</view>
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

      <!-- 今日课程提醒 -->
      <ming-container>
        <template v-slot:title>
          <text>今日课程提醒</text>
        </template>
        <template v-slot:desc>
          <text>今天也要元气满满哦～加油～</text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            <view v-if="todayReminders.length" class="today-list">
              <view
                v-for="item in todayReminders"
                :key="item.timeGroupKey"
                class="today-card"
                :class="{ 'today-card--starred': item.hasStarred }"
                @tap="openDetailWithTimeGroup(item)"
              >
                <view class="today-card__header">
                  <view class="today-card__name-row">
                    <text v-if="item.hasStarred" class="today-card__star">★</text>
                    <text class="today-card__name">{{ item.courseName }}</text>
                  </view>
                  <text class="today-card__time">{{ item.timeText }}</text>
                </view>
                <view v-if="item.address" class="today-card__address text-dark">{{ item.address }}</view>
                <view v-if="item.notes.length" class="today-card__notes">
                  <view
                    v-for="note in item.notes.slice(0, 3)"
                    :key="note.noteId"
                    class="today-card__note"
                    :class="{ 'today-card__note--starred': note.starred }"
                  >
                    {{ note.content.slice(0, 50) }}{{ note.content.length > 50 ? '...' : '' }}
                  </view>
                </view>
                <view v-else class="today-card__empty text-dark">暂无备注</view>
              </view>
            </view>
            <view v-else class="today-empty">
              <view class="today-empty__icon">~</view>
              <view class="today-empty__text text-dark">今天没有课，享受自由时光吧</view>
            </view>
          </view>
        </template>
      </ming-container>

      <!-- 全部课程备注 -->
      <ming-container>
        <template v-slot:title>
          <text>全部课程备注</text>
        </template>
        <template v-slot:desc>
          <text>
            按课程分类查看和管理备注。
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

    <!-- FAB 快速添加按钮（可拖拽） -->
    <movable-area class="fab-area">
      <movable-view
        class="fab"
        direction="all"
        :x="fabX"
        :y="fabY"
        :style="'background-color:' + getThemeColor.curBg"
        @tap="openQuickAdd"
      >
        <text class="fab__icon" :style="'color:' + getThemeColor.curTextC">+</text>
      </movable-view>
    </movable-area>

    <!-- 快速添加底部面板 -->
    <view v-if="showQuickAdd" class="quick-add-mask" @tap="closeQuickAdd">
      <view class="quick-add-panel" @tap.stop>
        <view class="quick-add-panel__header">
          <text class="quick-add-panel__title">快速添加备注</text>
          <text class="quick-add-panel__close" @tap="closeQuickAdd">x</text>
        </view>

        <!-- 课程选择 -->
        <view class="quick-add-panel__section">
          <text class="quick-add-panel__label">选择课程</text>
          <scroll-view scroll-x class="quick-add-panel__course-scroll">
            <view class="quick-add-panel__course-list">
              <view
                v-for="item in courseList"
                :key="item.courseKey"
                class="quick-add-panel__course-chip"
                :class="{ 'quick-add-panel__course-chip--active': quickAddCourseKey === item.courseKey }"
                :style="quickAddCourseKey === item.courseKey ? 'background-color:' + getThemeColor.curBg + ';color:' + getThemeColor.curTextC : ''"
                @tap="selectQuickAddCourse(item)"
              >
                {{ item.cn }}
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 时间段选择 -->
        <view v-if="quickAddTimeGroups.length" class="quick-add-panel__section">
          <text class="quick-add-panel__label">选择时间</text>
          <scroll-view scroll-x class="quick-add-panel__course-scroll">
            <view class="quick-add-panel__course-list">
              <view
                v-for="tg in quickAddTimeGroups"
                :key="tg.timeGroupKey"
                class="quick-add-panel__course-chip"
                :class="{ 'quick-add-panel__course-chip--active': quickAddTimeGroupKey === tg.timeGroupKey }"
                :style="quickAddTimeGroupKey === tg.timeGroupKey ? 'background-color:' + getThemeColor.curBg + ';color:' + getThemeColor.curTextC : ''"
                @tap="quickAddTimeGroupKey = tg.timeGroupKey"
              >
                {{ tg.weekdayText }} {{ tg.timeText }}
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 内容输入 -->
        <view class="quick-add-panel__section">
          <textarea
            class="quick-add-panel__textarea"
            v-model="quickAddContent"
            placeholder="写点什么..."
            :maxlength="500"
            :adjust-position="true"
          ></textarea>
        </view>

        <view class="quick-add-panel__footer">
          <view
            class="quick-add-panel__save"
            :style="{ backgroundColor: getThemeColor.curBg, color: getThemeColor.curTextC }"
            @tap="handleQuickAddSave"
          >
            保存
          </view>
        </view>
      </view>
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
  getTodayReminders,
  quickAddNote,
} from '@/utils/courseRemark'

export default {
  components: {
    Ztl,
    MingContainer,
  },
  setup() {
    const store = useStore()
    const mergedCourseList = ref([])
    const todayReminders = ref([])
    const showWishPool = ref(false)

    // FAB position & quick add state
    const fabX = ref(9999)
    const fabY = ref(9999)
    const showQuickAdd = ref(false)
    const quickAddCourseKey = ref('')
    const quickAddTimeGroupKey = ref('')
    const quickAddContent = ref('')

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

    const quickAddTimeGroups = computed(() => {
      const course = mergedCourseList.value.find(c => c.courseKey === quickAddCourseKey.value)
      return course?.timeGroups || []
    })

    const loadCourseList = () => {
      const storeSchedule = store.state.scheduleInfo.schedule
      const schedule = (Array.isArray(storeSchedule) && storeSchedule.length ? storeSchedule : uni.getStorageSync('weeksData')) || []
      mergedCourseList.value = mergeRemarkCourseList(schedule)

      // 取当前周的课表用于今日提醒过滤
      const currentWeek = store.state.scheduleInfo.currentWeek || uni.getStorageSync('currentWeek') || 0
      const currentWeekSchedule = Array.isArray(schedule[currentWeek]) ? schedule[currentWeek] : []
      todayReminders.value = getTodayReminders(mergedCourseList.value, currentWeekSchedule)
    }

    const openDetail = course => {
      uni.navigateTo({
        url: `/pages/remark/RemarkDetail?courseKey=${encodeURIComponent(course.courseKey)}`,
      })
    }

    const openDetailWithTimeGroup = item => {
      uni.navigateTo({
        url: `/pages/remark/RemarkDetail?courseKey=${encodeURIComponent(item.courseKey)}&timeGroupKey=${encodeURIComponent(item.timeGroupKey)}`,
      })
    }

    const scrollToBackup = () => {
      uni.createSelectorQuery()
        .select('#remark-backup-section')
        .boundingClientRect(data => {
          if (!data) return
          uni.pageScrollTo({ scrollTop: data.top, duration: 300 })
        })
        .exec()
    }

    const handleExportRemark = () => {
      exportRemarkData()
        .then(() => uni.showToast({ title: '请在微信里选择保存或转发', icon: 'none' }))
        .catch(e => {
          console.error(e)
          uni.showToast({ title: e.message || '导出失败', icon: 'none' })
        })
    }

    const handleImportRemark = () => {
      importRemarkData()
        .then(() => loadCourseList())
        .catch(e => {
          console.error(e)
          if (e?.errMsg?.includes('cancel')) return
          uni.showToast({ title: e.message || '导入失败', icon: 'none' })
        })
    }

    // Quick add
    const openQuickAdd = () => {
      showQuickAdd.value = true
      quickAddContent.value = ''
      // 默认选中第一个课程和时间段
      if (courseList.value.length) {
        const first = courseList.value[0]
        quickAddCourseKey.value = first.courseKey
        quickAddTimeGroupKey.value = first.timeGroups?.[0]?.timeGroupKey || ''
      }
    }

    const closeQuickAdd = () => {
      showQuickAdd.value = false
    }

    const selectQuickAddCourse = (item) => {
      quickAddCourseKey.value = item.courseKey
      quickAddTimeGroupKey.value = item.timeGroups?.[0]?.timeGroupKey || ''
    }

    const handleQuickAddSave = () => {
      if (!quickAddContent.value.trim()) {
        uni.showToast({ title: '请输入备注内容', icon: 'none' })
        return
      }
      if (!quickAddCourseKey.value || !quickAddTimeGroupKey.value) {
        uni.showToast({ title: '请选择课程和时间', icon: 'none' })
        return
      }

      const success = quickAddNote(quickAddCourseKey.value, quickAddTimeGroupKey.value, quickAddContent.value)
      if (success) {
        uni.showToast({ title: '保存成功', icon: 'success' })
        closeQuickAdd()
        loadCourseList()
      } else {
        uni.showToast({ title: '保存失败，请重试', icon: 'none' })
      }
    }

    onShow(() => {
      loadCourseList()
    })

    return {
      showWishPool,
      todayReminders,
      courseList,
      getThemeColor,
      openDetail,
      openDetailWithTimeGroup,
      scrollToBackup,
      handleExportRemark,
      handleImportRemark,
      // FAB
      fabX,
      fabY,
      // Quick add
      showQuickAdd,
      quickAddCourseKey,
      quickAddTimeGroupKey,
      quickAddContent,
      quickAddTimeGroups,
      openQuickAdd,
      closeQuickAdd,
      selectQuickAddCourse,
      handleQuickAddSave,
    }
  },
}
</script>

<style lang="scss" scoped>
.remark-page {
  padding-bottom: 120rpx;
}

/* ============ 许愿池公告 ============ */
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

/* ============ 今日提醒 ============ */
.today-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.today-card {
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f9fafb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  &--starred {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }
}

.today-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.today-card__name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  min-width: 0;
}

.today-card__star {
  color: #f59e0b;
  font-size: 28rpx;
  font-weight: bold;
}

.today-card__name {
  font-size: 30rpx;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.today-card__time {
  font-size: 26rpx;
  color: #6b7280;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.today-card__address {
  margin-top: 8rpx;
  font-size: 24rpx;
}

.today-card__notes {
  margin-top: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.today-card__note {
  font-size: 24rpx;
  color: #4b5563;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--starred {
    font-weight: 600;
    color: #92400e;
  }
}

.today-card__empty {
  margin-top: 8rpx;
  font-size: 24rpx;
}

.today-empty {
  padding: 48rpx 0 24rpx;
  text-align: center;
}

.today-empty__icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.today-empty__text {
  font-size: 26rpx;
}

/* ============ FAB（可拖拽） ============ */
.fab-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
  padding: 30rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
  box-sizing: border-box;
  pointer-events: none;
  z-index: 100;
}

.fab {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.fab__icon {
  font-size: 48rpx;
  font-weight: 300;
  line-height: 1;
}

/* ============ 快速添加面板 ============ */
.quick-add-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.quick-add-panel {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx 32rpx calc(env(safe-area-inset-bottom) + 32rpx);
  max-height: 80vh;
  animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.quick-add-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.quick-add-panel__title {
  font-size: 32rpx;
  font-weight: 600;
}

.quick-add-panel__close {
  font-size: 36rpx;
  color: #9ca3af;
  padding: 8rpx 16rpx;
}

.quick-add-panel__section {
  margin-bottom: 24rpx;
}

.quick-add-panel__label {
  font-size: 24rpx;
  color: #6b7280;
  margin-bottom: 12rpx;
  display: block;
}

.quick-add-panel__course-scroll {
  white-space: nowrap;
}

.quick-add-panel__course-list {
  display: inline-flex;
  gap: 16rpx;
  padding: 4rpx 0;
}

.quick-add-panel__course-chip {
  display: inline-flex;
  align-items: center;
  padding: 14rpx 24rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  font-size: 24rpx;
  color: #374151;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &--active {
    font-weight: 500;
  }
}

.quick-add-panel__textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 2px solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;
  box-sizing: border-box;
  background: #f9fafb;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #6b7280;
  }
}

.quick-add-panel__footer {
  margin-top: 8rpx;
}

.quick-add-panel__save {
  width: 100%;
  height: 80rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
}

/* ============ 原有样式保留 ============ */
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
