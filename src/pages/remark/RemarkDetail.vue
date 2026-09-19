<template>
  <view class="position-relative">
    <Ztl>
      <template v-slot:navName>
        <view>课程备注</view>
      </template>
    </Ztl>
    <view class="w-1 px-3">
      <ming-container class="w-1 p-3">
        <template v-slot:title>
          <text>{{ course.cn || '课程备注' }}</text>
        </template>
        <template v-slot:desc>
          <text>{{ courseSummary }}</text>
        </template>
        <template v-slot:default>
          <view class="w-1">
            <!-- 时间段 tab 筛选 -->
            <view v-if="course.timeGroups.length" class="w-1">
              <view class="remark-group-selector">
                <view
                  v-for="group in course.timeGroups"
                  :key="group.timeGroupKey"
                  class="remark-group-selector__item"
                  :class="{ 'remark-group-selector__item--active': group.timeGroupKey === selectedTimeGroupKey }"
                  @tap="selectTimeGroup(group.timeGroupKey)"
                >
                  <view class="remark-group-selector__title">{{ group.weekdayText }} {{ group.timeText }}</view>
                  <view class="remark-group-selector__meta" v-if="group.ad">{{ group.ad }}</view>
                </view>
              </view>

              <!-- 备注列表（平铺展示，始终可编辑） -->
              <view v-if="selectedGroup" class="remark-notes-list">
                <view class="remark-notes-list__header">
                  <view>
                    <view class="remark-notes-list__title">{{ selectedGroup.weekdayText }} {{ selectedGroup.timeText }}</view>
                    <view class="remark-notes-list__meta text-dark" v-if="selectedGroup.ad">
                      地点：{{ selectedGroup.ad }}
                    </view>
                  </view>
                  <view class="remark-notes-list__actions">
                    <text class="remark-notes-list__import" @tap="handleImportNote">导入</text>
                  </view>
                </view>

                <view v-if="selectedGroup.notes.length" class="remark-notes-cards">
                  <view
                    v-for="(note, noteIndex) in selectedGroup.notes"
                    :key="note.noteId"
                    class="remark-note-card depth-1"
                    :class="{ 'remark-note-card--starred': note.starred }"
                  >
                    <view class="remark-note-card__toolbar">
                      <input
                        class="remark-note-card__title-input"
                        :value="note.title"
                        :placeholder="`备注 ${noteIndex + 1}`"
                        maxlength="40"
                        @input="(e) => updateNoteTitle(noteIndex, e)"
                      />
                      <view class="remark-note-card__actions">
                        <view
                          class="remark-note-card__star-btn"
                          :class="{ 'remark-note-card__star-btn--active': note.starred }"
                          @tap="toggleStar(noteIndex)"
                        >
                          <text class="remark-note-card__star-icon">{{ note.starred ? '★' : '☆' }}</text>
                          <text class="remark-note-card__star-text">{{ note.starred ? '已标记' : '标记' }}</text>
                        </view>
                        <text class="remark-note-card__action" @tap="handleExportNote(noteIndex)">分享</text>
                        <text class="remark-note-card__action remark-note-card__action--delete" @tap="confirmRemoveNote(noteIndex)">删除</text>
                      </view>
                    </view>
                    <textarea
                      class="remark-note-card__textarea"
                      :maxlength="maxLength"
                      :value="note.content"
                      placeholder="记录重点、待办或提醒..."
                      @input="(e) => updateNoteContent(noteIndex, e)"
                    ></textarea>
                    <view class="remark-note-card__footer">
                      <text class="remark-note-card__count text-dark">{{ note.content.length }}/{{ maxLength }}</text>
                    </view>
                  </view>
                </view>

                <view v-else class="remark-empty text-dark">
                  当前时间段还没有备注
                </view>

                <!-- 新增备注按钮 -->
                <view class="remark-add-btn" @tap="addNote">
                  <text class="remark-add-btn__text">+ 新增备注</text>
                </view>
              </view>
            </view>

            <view v-else class="remark-empty text-dark">当前课程暂无可备注的上课时间。</view>

            <view class="w-1 mt-5" :style="{ height: '60px' }">
              <watch-button @tap="handleSave" value="保存" :themeColor="getThemeColor"> </watch-button>
            </view>
          </view>
        </template>
      </ming-container>
    </view>
  </view>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import {
  COURSE_REMARK_MAX_LENGTH,
  createRemarkNote,
  getRemarkCourseDetail,
  saveRemarkCourseDetail,
  exportSingleRemarkNote,
  importSingleRemarkNote,
} from '@/utils/courseRemark'

const createDefaultCourse = () => ({
  courseKey: '',
  cn: '',
  tn: '',
  id: undefined,
  timeGroups: [],
})

export default {
  components: {
    Ztl,
    MingContainer,
    WatchButton,
  },
  onLoad(options = {}) {
    this.courseKey = decodeURIComponent(options.courseKey || '')
    this.timeGroupKey = decodeURIComponent(options.timeGroupKey || '')
    this.initPage()
  },
  setup() {
    const store = useStore()
    const courseKey = ref('')
    const timeGroupKey = ref('')
    const selectedTimeGroupKey = ref('')
    const maxLength = COURSE_REMARK_MAX_LENGTH
    const course = reactive(createDefaultCourse())

    const getThemeColor = computed(() => store.state.theme)

    const selectedGroup = computed(() => {
      return course.timeGroups.find(group => group.timeGroupKey === selectedTimeGroupKey.value) || null
    })

    const normalizeCourseForView = targetCourse => {
      Object.assign(course, createDefaultCourse(), targetCourse || createDefaultCourse())

      let nextSelectedGroupKey = course.timeGroups[0]?.timeGroupKey || ''
      const routeGroup = course.timeGroups.find(group => group.timeGroupKey === timeGroupKey.value)
      if (routeGroup) {
        nextSelectedGroupKey = routeGroup.timeGroupKey
      }
      selectedTimeGroupKey.value = nextSelectedGroupKey
    }

    const initPage = () => {
      const storeSchedule = store.state.scheduleInfo.schedule
      const schedule = (Array.isArray(storeSchedule) && storeSchedule.length ? storeSchedule : uni.getStorageSync('weeksData')) || []
      const targetCourse = getRemarkCourseDetail(schedule, courseKey.value)
      normalizeCourseForView(targetCourse)
    }

    const selectTimeGroup = groupKey => {
      if (!groupKey) return
      selectedTimeGroupKey.value = groupKey
    }

    const addNote = () => {
      if (!selectedGroup.value) return
      const nextNote = createRemarkNote(selectedGroup.value.notes.length, '')
      selectedGroup.value.notes.push(nextNote)
    }

    const confirmRemoveNote = (noteIndex) => {
      if (!selectedGroup.value) return
      uni.showModal({
        title: '确认删除',
        content: '删除后将立即生效，确认删除这条备注吗？',
        success: ({ confirm }) => {
          if (confirm) {
            selectedGroup.value.notes.splice(noteIndex, 1)
            selectedGroup.value.notes.forEach((item, index) => {
              item.sortOrder = index
            })
            saveRemarkCourseDetail(course)
            uni.showToast({ title: '已删除', icon: 'success' })
          }
        },
      })
    }

    const toggleStar = (noteIndex) => {
      if (!selectedGroup.value) return
      const note = selectedGroup.value.notes[noteIndex]
      if (!note) return
      note.starred = !note.starred
      note.updatedAt = Date.now()
    }

    const updateNoteTitle = (noteIndex, event) => {
      if (!selectedGroup.value) return
      const note = selectedGroup.value.notes[noteIndex]
      if (!note) return
      note.title = `${event?.target?.value || ''}`.slice(0, 40)
      note.updatedAt = Date.now()
    }

    const updateNoteContent = (noteIndex, event) => {
      if (!selectedGroup.value) return
      const note = selectedGroup.value.notes[noteIndex]
      if (!note) return
      note.content = `${event?.target?.value || ''}`.slice(0, maxLength)
      note.updatedAt = Date.now()
    }

    const handleSave = () => {
      saveRemarkCourseDetail(course)
      uni.showToast({ title: '保存成功', icon: 'success' })
    }

    const handleExportNote = async (noteIndex) => {
      if (!selectedGroup.value) return
      const note = selectedGroup.value.notes[noteIndex]
      if (!note?.content) {
        uni.showToast({ title: '备注内容为空', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '正在准备分享...' })
        const courseName = course.cn
        const timeText = selectedGroup.value.weekdayText + ' ' + selectedGroup.value.timeText
        await exportSingleRemarkNote(courseName, timeText, note)
        uni.hideLoading()
      } catch (e) {
        uni.hideLoading()
        if (e.errMsg && e.errMsg.includes('cancel')) return
        uni.showToast({ title: '分享失败', icon: 'none' })
      }
    }

    const handleImportNote = async () => {
      if (!selectedGroup.value) return
      try {
        const importedNote = await importSingleRemarkNote()
        const nextNote = createRemarkNote(selectedGroup.value.notes.length, importedNote.content || '')
        nextNote.title = importedNote.title || ''
        selectedGroup.value.notes.push(nextNote)
        uni.showToast({ title: '导入成功', icon: 'success' })
      } catch (e) {
        if (e.errMsg && e.errMsg.includes('cancel')) return
      }
    }

    const courseSummary = computed(() => {
      const info = []
      if (course.tn) info.push(course.tn)
      if (course.timeGroups.length) info.push(`共 ${course.timeGroups.length} 个上课时间`)
      return info.join(' / ') || '按不同上课时间分别记录备注'
    })

    return {
      courseKey,
      timeGroupKey,
      course,
      maxLength,
      getThemeColor,
      selectedTimeGroupKey,
      selectedGroup,
      courseSummary,
      initPage,
      handleSave,
      selectTimeGroup,
      addNote,
      confirmRemoveNote,
      toggleStar,
      updateNoteTitle,
      updateNoteContent,
      handleExportNote,
      handleImportNote,
    }
  },
}
</script>

<style lang="scss" scoped>
.remark-group-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
}

.remark-group-selector__item {
  min-width: 220rpx;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: #f3f4f6;
  transition: background 0.2s ease, transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
}

.remark-group-selector__item--active {
  background: #e5e7eb;
}

.remark-group-selector__title {
  font-size: 24rpx;
  font-weight: 600;
  color: #111827;
}

.remark-group-selector__meta {
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #6b7280;
}

/* ============ 备注列表 ============ */
.remark-notes-list {
  margin-top: 24rpx;
}

.remark-notes-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 20rpx;
}

.remark-notes-list__title {
  font-size: 28rpx;
  font-weight: 600;
}

.remark-notes-list__meta {
  margin-top: 8rpx;
  font-size: 24rpx;
}

.remark-notes-list__actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.remark-notes-list__import {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100rpx;
  height: 56rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 24rpx;
}

/* ============ 备注卡片 ============ */
.remark-notes-cards {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.remark-note-card {
  width: 100%;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &--starred {
    background: linear-gradient(135deg, #fffbeb 0%, #fef9e7 100%);
    border: 1px solid #fde68a;
  }
}

.remark-note-card__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.remark-note-card__title-input {
  flex: 1;
  min-width: 0;
  height: 56rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
}

.remark-note-card__actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-shrink: 0;
}

.remark-note-card__star-btn {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;

  &--active {
    background: #fef3c7;
    border-color: #f59e0b;
  }
}

.remark-note-card__star-icon {
  font-size: 28rpx;
  color: #d1d5db;
  transition: color 0.25s ease, transform 0.25s ease;

  .remark-note-card__star-btn--active & {
    color: #f59e0b;
    transform: scale(1.15);
  }
}

.remark-note-card__star-text {
  font-size: 22rpx;
  color: #9ca3af;

  .remark-note-card__star-btn--active & {
    color: #b45309;
    font-weight: 500;
  }
}

.remark-note-card__action {
  font-size: 24rpx;
  color: #3b82f6;
  padding: 8rpx 0;

  &--delete {
    color: #ef4444;
  }
}

.remark-note-card__textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  border: 2px solid #e5e7eb;
  border-radius: 16rpx;
  background: #fff;
  font-size: 24rpx;
  line-height: 1.6;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.remark-note-card__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8rpx;
}

.remark-note-card__count {
  font-size: 22rpx;
}

/* ============ 新增按钮 ============ */
.remark-add-btn {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  border: 2px dashed #d1d5db;
  text-align: center;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:active {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
}

.remark-add-btn__text {
  font-size: 26rpx;
  color: #6b7280;
}

.remark-empty {
  margin-top: 32rpx;
  text-align: center;
  font-size: 26rpx;
}
</style>
