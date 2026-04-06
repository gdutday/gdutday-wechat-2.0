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

              <view v-if="selectedGroup" class="remark-group-panel depth-1">
                <view class="remark-group-panel__header">
                  <view>
                    <view class="remark-group-panel__title">{{ selectedGroup.weekdayText }} {{ selectedGroup.timeText }}</view>
                    <view class="remark-group-panel__meta text-dark" v-if="selectedGroup.ad">
                      地点：{{ selectedGroup.ad }}
                    </view>
                  </view>
                  <view class="remark-group-panel__actions">
                    <text class="remark-group-panel__import" @tap="handleImportNote">导入分享</text>
                    <text class="remark-group-panel__add" @tap="addNote">新增备注</text>
                  </view>
                </view>

                <view v-if="totalNotes" class="w-1">
                  <view class="remark-note-card depth-1">
                    <view class="remark-note-card__toolbar">
                      <input
                        class="remark-note-card__title-input"
                        :value="currentNoteTitle"
                        :placeholder="defaultNoteTitle"
                        maxlength="40"
                        @input="updateCurrentNoteTitle"
                      />
                      <view class="remark-note-card__actions">
                        <text class="remark-note-card__action" @tap="handleExportNote" v-if="!isEditing">分享</text>
                        <text class="remark-note-card__action" @tap="toggleEdit">{{ isEditing ? '完成' : '编辑' }}</text>
                        <text class="remark-note-card__action" @tap="confirmRemoveCurrentNote">删除</text>
                      </view>
                    </view>
                    <view :style="{ width: '100%', height: '300px' }" class="mt-3">
                      <!-- 编辑态 -->
                      <textarea
                        v-if="isEditing"
                        class="remark-note-card__textarea"
                        :maxlength="maxLength"
                        :value="currentNote.content"
                        placeholder="记录这个上课时间下的重点、待办或提醒"
                        @input="updateCurrentNoteContent"
                        :focus="isEditing"
                      ></textarea>
                      
                      <!-- 预览态（支持识别链接） -->
                      <view 
                        v-else 
                        class="remark-note-card__textarea remark-note-card__preview"
                      >
                        <text v-if="!currentNote.content" class="text-dark">点击右上角「编辑」开始输入...</text>
                        <block v-else>
                          <text 
                            v-for="(part, index) in parsedContent" 
                            :key="index"
                            :user-select="true"
                            :class="{ 'remark-note-card__link': part.type === 'link' }"
                            @tap="part.type === 'link' ? handleLinkClick(part.content) : null"
                          >{{ part.content }}</text>
                        </block>
                      </view>
                    </view>
                    <view class="remark-note-card__hint text-dark">
                      <text v-if="isEditing">最多 {{ maxLength }} 字</text>
                    </view>
                    <view class="remark-note-card__count text-dark">{{ currentNote.content.length }}/{{ maxLength }}</view>
                  </view>

                  <view class="remark-note-nav">
                    <text
                      class="remark-note-nav__arrow"
                      :class="{ 'remark-note-nav__arrow--disabled': currentPage <= 1 }"
                      @tap="goPrevNote"
                    >
                      ←
                    </text>
                    <view class="remark-note-nav__center">
                      <view class="remark-note-nav__count">{{ currentPage }} / {{ totalNotes }}</view>
                      <view class="remark-note-nav__jump">
                        <input
                          class="remark-note-nav__input"
                          type="number"
                          :value="pageInputValue"
                          @input="handlePageInput"
                          @blur="jumpToInputPage"
                          placeholder="页码"
                        />
                        <text class="remark-note-nav__jump-btn" @tap="jumpToInputPage">跳转</text>
                      </view>
                    </view>
                    <text
                      class="remark-note-nav__arrow"
                      :class="{ 'remark-note-nav__arrow--disabled': currentPage >= totalNotes }"
                      @tap="goNextNote"
                    >
                      →
                    </text>
                  </view>
                </view>

                <view v-else class="remark-empty text-dark">
                  当前时间段还没有备注，点击右上角新增备注开始记录。
                </view>
              </view>
            </view>

            <view v-else class="remark-empty text-dark">当前课程暂无可备注的上课时间。</view>

            <view class="remark-tip w-1 text-dark">切换时间段后会记住你上次浏览到的备注位置。</view>
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
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Ztl from '@/components/common/Ztl.vue'
import MingContainer from '@/components/common/MingContainer.vue'
import WatchButton from '@/components/common/WatchButton.vue'
import {
  COURSE_REMARK_MAX_LENGTH,
  createRemarkNote,
  getRemarkCourseDetail,
  saveRemarkCourseDetail,
  parseTextWithLinks,
  exportSingleRemarkNote,
  importSingleRemarkNote
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
    this.noteId = decodeURIComponent(options.noteId || '')
    this.initPage()
  },
  setup() {
    const store = useStore()
    const courseKey = ref('')
    const timeGroupKey = ref('')
    const noteId = ref('')
    const selectedTimeGroupKey = ref('')
    const pageInputValue = ref('1')
    const currentNoteIndexMap = ref({})
    const maxLength = COURSE_REMARK_MAX_LENGTH
    const course = reactive(createDefaultCourse())

    const getThemeColor = computed(() => store.state.theme)

    const selectedGroup = computed(() => {
      return course.timeGroups.find(group => group.timeGroupKey === selectedTimeGroupKey.value) || null
    })

    const totalNotes = computed(() => selectedGroup.value?.notes?.length || 0)

    const currentNoteIndex = computed(() => {
      const groupKey = selectedTimeGroupKey.value
      const noteCount = totalNotes.value
      if (!groupKey || !noteCount) return 0
      const storedIndex = Number(currentNoteIndexMap.value[groupKey] || 0)
      return Math.min(Math.max(storedIndex, 0), noteCount - 1)
    })

    const currentPage = computed(() => (totalNotes.value ? currentNoteIndex.value + 1 : 0))

    const currentNote = computed(() => {
      return selectedGroup.value?.notes?.[currentNoteIndex.value] || createRemarkNote(0, '')
    })

    const defaultNoteTitle = computed(() => `备注 ${currentPage.value || 1}`)

    const currentNoteTitle = computed(() => currentNote.value?.title || '')

    const isEditing = ref(false)

    const parsedContent = computed(() => {
      return parseTextWithLinks(currentNote.value?.content || '')
    })

    const toggleEdit = () => {
      isEditing.value = !isEditing.value
    }

    const handleLinkClick = (url) => {
      uni.setClipboardData({
        data: url,
        showToast: false,
        success: () => {
          uni.showToast({
            title: '链接已复制，请前往浏览器打开',
            icon: 'none',
            duration: 2500
          })
        }
      })
    }

    const syncPageInputValue = () => {
      pageInputValue.value = totalNotes.value ? `${currentPage.value}` : '1'
    }

    const setCurrentNoteIndex = (groupKey, nextIndex = 0) => {
      const targetGroup = course.timeGroups.find(group => group.timeGroupKey === groupKey)
      const noteCount = targetGroup?.notes?.length || 0
      const normalizedIndex = noteCount ? Math.min(Math.max(Number(nextIndex) || 0, 0), noteCount - 1) : 0

      currentNoteIndexMap.value = {
        ...currentNoteIndexMap.value,
        [groupKey]: normalizedIndex,
      }
    }

    const normalizeCourseForView = targetCourse => {
      Object.assign(course, createDefaultCourse(), targetCourse || createDefaultCourse())

      const nextIndexMap = {}
      course.timeGroups.forEach(group => {
        nextIndexMap[group.timeGroupKey] = 0
      })

      let nextSelectedGroupKey = course.timeGroups[0]?.timeGroupKey || ''
      const routeGroup = course.timeGroups.find(group => group.timeGroupKey === timeGroupKey.value)
      if (routeGroup) {
        nextSelectedGroupKey = routeGroup.timeGroupKey
      }

      if (routeGroup && noteId.value) {
        const noteIndex = routeGroup.notes.findIndex(note => note.noteId === noteId.value)
        if (noteIndex >= 0) {
          nextIndexMap[routeGroup.timeGroupKey] = noteIndex
        }
      }

      currentNoteIndexMap.value = nextIndexMap
      selectedTimeGroupKey.value = nextSelectedGroupKey
      syncPageInputValue()
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
      setCurrentNoteIndex(groupKey, currentNoteIndexMap.value[groupKey] || 0)
      syncPageInputValue()
    }

    const goPrevNote = () => {
      if (!selectedGroup.value || currentPage.value <= 1) return
      setCurrentNoteIndex(selectedTimeGroupKey.value, currentNoteIndex.value - 1)
    }

    const goNextNote = () => {
      if (!selectedGroup.value || currentPage.value >= totalNotes.value) return
      setCurrentNoteIndex(selectedTimeGroupKey.value, currentNoteIndex.value + 1)
    }

    const handlePageInput = event => {
      pageInputValue.value = `${event?.target?.value || ''}`.replace(/[^0-9]/g, '')
    }

    const jumpToInputPage = () => {
      if (!selectedGroup.value || !totalNotes.value) {
        syncPageInputValue()
        return
      }

      const targetPage = Math.min(Math.max(Number(pageInputValue.value) || 1, 1), totalNotes.value)
      setCurrentNoteIndex(selectedTimeGroupKey.value, targetPage - 1)
      pageInputValue.value = `${targetPage}`
    }

    const addNote = () => {
      if (!selectedGroup.value) return

      const groupKey = selectedTimeGroupKey.value
      const insertIndex = totalNotes.value ? currentNoteIndex.value + 1 : 0
      const nextNote = createRemarkNote(insertIndex, '')
      const nextNotes = [...selectedGroup.value.notes]
      nextNotes.splice(insertIndex, 0, nextNote)
      selectedGroup.value.notes = nextNotes.map((item, index) => ({ ...item, sortOrder: index }))
      setCurrentNoteIndex(groupKey, insertIndex)
    }

    const removeCurrentNote = () => {
      if (!selectedGroup.value || !totalNotes.value) return

      const groupKey = selectedTimeGroupKey.value
      const nextNotes = selectedGroup.value.notes
        .filter((_, index) => index !== currentNoteIndex.value)
        .map((item, index) => ({
          ...item,
          sortOrder: index,
        }))

      selectedGroup.value.notes = nextNotes
      const nextIndex = currentNoteIndex.value > 0 ? currentNoteIndex.value - 1 : 0
      setCurrentNoteIndex(groupKey, nextIndex)
      saveRemarkCourseDetail(course)
      uni.showToast({
        title: '已删除',
        icon: 'success',
      })
    }

    const confirmRemoveCurrentNote = () => {
      if (!selectedGroup.value || !totalNotes.value) return
      uni.showModal({
        title: '确认删除',
        content: '删除后将立即生效，确认删除这条备注吗？',
        success: ({ confirm }) => {
          if (confirm) {
            removeCurrentNote()
          }
        },
      })
    }

    const handleExportNote = async () => {
      if (!selectedGroup.value || !currentNote.value) return
      if (!currentNote.value.content) {
        uni.showToast({
          title: '备注内容为空',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '正在准备分享...' })
        const courseName = course.cn
        const timeText = selectedGroup.value.weekdayText + ' ' + selectedGroup.value.timeText
        await exportSingleRemarkNote(courseName, timeText, currentNote.value)
        uni.hideLoading()
      } catch (e) {
        uni.hideLoading()
        if (e.errMsg && e.errMsg.includes('cancel')) {
          // 用户取消分享
          return
        }
        uni.showToast({ title: '分享失败', icon: 'none' })
      }
    }

    const handleImportNote = async () => {
      if (!selectedGroup.value) return
      
      try {
        const importedNote = await importSingleRemarkNote()
        
        const groupKey = selectedTimeGroupKey.value
        const insertIndex = totalNotes.value ? currentNoteIndex.value + 1 : 0
        const nextNote = createRemarkNote(insertIndex, importedNote.content || '')
        nextNote.title = importedNote.title || ''
        
        const nextNotes = [...selectedGroup.value.notes]
        nextNotes.splice(insertIndex, 0, nextNote)
        selectedGroup.value.notes = nextNotes.map((item, index) => ({ ...item, sortOrder: index }))
        setCurrentNoteIndex(groupKey, insertIndex)
        
        uni.showToast({
          title: '导入成功',
          icon: 'success'
        })
      } catch (e) {
        if (e.errMsg && e.errMsg.includes('cancel')) {
          return
        }
        // 错误提示已在 importSingleRemarkNote 中处理
      }
    }

    const updateCurrentNoteTitle = event => {
      if (!selectedGroup.value || !totalNotes.value) return
      const value = `${event?.target?.value || ''}`.slice(0, 40)
      const targetNote = selectedGroup.value.notes[currentNoteIndex.value]
      if (!targetNote) return
      targetNote.title = value
      targetNote.updatedAt = Date.now()
    }

    const updateCurrentNoteContent = event => {
      if (!selectedGroup.value || !totalNotes.value) return
      const value = `${event?.target?.value || ''}`.slice(0, maxLength)
      const targetNote = selectedGroup.value.notes[currentNoteIndex.value]
      if (!targetNote) return
      targetNote.content = value
      targetNote.updatedAt = Date.now()
    }

    const handleSave = () => {
      saveRemarkCourseDetail(course)
      uni.showToast({
        title: '保存成功',
        icon: 'success',
      })
    }

    const courseSummary = computed(() => {
      const info = []
      if (course.tn) info.push(course.tn)
      if (course.timeGroups.length) info.push(`共 ${course.timeGroups.length} 个上课时间`)
      return info.join(' / ') || '按不同上课时间分别记录备注'
    })

    watch([selectedTimeGroupKey, currentNoteIndex, totalNotes], () => {
      syncPageInputValue()
    })

    return {
      courseKey,
      timeGroupKey,
      noteId,
      course,
      maxLength,
      getThemeColor,
      selectedTimeGroupKey,
      selectedGroup,
      currentNote,
      currentPage,
      totalNotes,
      pageInputValue,
      defaultNoteTitle,
      currentNoteTitle,
      isEditing,
      parsedContent,
      toggleEdit,
      handleLinkClick,
      courseSummary,
      initPage,
      handleSave,
      selectTimeGroup,
      goPrevNote,
      goNextNote,
      handlePageInput,
      jumpToInputPage,
      addNote,
      confirmRemoveCurrentNote,
      handleExportNote,
      handleImportNote,
      updateCurrentNoteTitle,
      updateCurrentNoteContent,
    }
  },
}
</script>

<style lang="scss" scoped>
.remark-course-card {
  width: 100%;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f9fafb;

  &__title {
    font-size: 30rpx;
    font-weight: 600;
  }

  &__meta {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #4b5563;
  }
}

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

.remark-group-panel {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #fff;
}

.remark-group-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.remark-group-panel__title {
  font-size: 28rpx;
  font-weight: 600;
}

.remark-group-panel__meta {
  margin-top: 12rpx;
  font-size: 24rpx;
}

.remark-group-panel__actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.remark-group-panel__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 132rpx;
  height: 56rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  font-size: 24rpx;
}

.remark-group-panel__import {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 132rpx;
  height: 56rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: #e0f2fe; /* 浅蓝色背景 */
  color: #0369a1;
  font-size: 24rpx;
}

.remark-note-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 20rpx;
}

.remark-note-nav__arrow {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f3f4f6;
  color: #111827;
  font-size: 32rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.remark-note-nav__arrow--disabled {
  color: #9ca3af;
  background: #f9fafb;
}

.remark-note-nav__center {
  flex: 1;
  min-width: 0;
}

.remark-note-nav__count {
  text-align: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #111827;
}

.remark-note-nav__jump {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.remark-note-nav__input {
  width: 120rpx;
  height: 56rpx;
  padding: 0 16rpx;
  border-radius: 14rpx;
  background: #f9fafb;
  text-align: center;
  font-size: 24rpx;
}

.remark-note-nav__jump-btn {
  padding: 0 20rpx;
  height: 56rpx;
  line-height: 56rpx;
  border-radius: 999rpx;
  background: #f3f4f6;
  font-size: 22rpx;
  color: #4b5563;
}

.remark-note-card {
  margin-top: 24rpx;
  width: 100%;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

.remark-note-card__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  gap: 24rpx;
}

.remark-note-card__action {
  font-size: 26rpx;
  color: #3b82f6; /* 改为类似微信的蓝色点击态 */
  padding: 8rpx 0;
}

.remark-note-card__action:last-child {
  color: #ef4444; /* 删除保持红色 */
}

.remark-note-card__hint {
  margin-top: 12rpx;
  font-size: 22rpx;
}

.remark-note-card__textarea {
  width: 100%;
  height: 100%;
  padding: 20rpx;
  border: 3px solid #d1d5db;
  border-radius: 16rpx;
  background: #fff;
  font-size: 24rpx;
  line-height: 1.6;
  box-sizing: border-box;
}

.remark-note-card__preview {
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.remark-note-card__link {
  color: #1296db;
  text-decoration: underline;
}

.remark-note-card__count {
  margin-top: 12rpx;
  font-size: 22rpx;
  text-align: right;
}

.remark-tip {
  margin-top: 28rpx;
  font-size: 24rpx;
}

.remark-empty {
  margin-top: 32rpx;
  text-align: center;
  font-size: 26rpx;
}
</style>
