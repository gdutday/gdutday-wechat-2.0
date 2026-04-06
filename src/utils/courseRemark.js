import { getStorageSync, getClassTime, uuidV4 } from '@/utils/common'
import { time } from '@/static/time.js'

export const COURSE_REMARK_STORAGE_KEY = 'courseRemarks:v3'
export const COURSE_REMARK_MAX_LENGTH = 10000

const WEEKDAY_TEXT = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export const normalizeCourseSections = sections => {
  if (Array.isArray(sections)) {
    return sections.map(item => `${item}`)
  }

  if (typeof sections === 'string' && sections.length) {
    return sections
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

export const getCourseWeekdayText = course => WEEKDAY_TEXT[Number(course?.wd) || 0] || '周一'

export const getCourseTimeText = course => {
  const sections = normalizeCourseSections(course?.cs)
  if (!sections.length) return ''
  return getClassTime(sections, time)
}

export const createCourseRemarkKey = (course = {}) => [course.cn || '', course.tn || ''].join('||')

export const createCourseTimeGroupKey = (course = {}) => {
  const sections = normalizeCourseSections(course.cs)
  return [`${course.wd ?? ''}`, sections.join(','), course.ad || ''].join('||')
}

export const createRemarkNote = (sortOrder = 0, content = '') => {
  const now = Date.now()
  return {
    noteId: uuidV4(),
    title: '',
    content,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  }
}

export const toRemarkTimeGroup = (course = {}) => {
  const sections = normalizeCourseSections(course.cs)
  const normalizedCourse = {
    wd: typeof course.wd === 'number' ? course.wd : 0,
    ad: course.ad || '',
    cs: sections,
  }

  return {
    timeGroupKey: createCourseTimeGroupKey(normalizedCourse),
    wd: normalizedCourse.wd,
    ad: normalizedCourse.ad,
    cs: normalizedCourse.cs,
    weekdayText: getCourseWeekdayText(normalizedCourse),
    timeText: getCourseTimeText(normalizedCourse),
    sortOrder: 0,
    notes: [],
  }
}

const sortTimeGroups = timeGroups => {
  return [...(timeGroups || [])].sort((prev, next) => {
    const weekdayDiff = (prev.wd || 0) - (next.wd || 0)
    if (weekdayDiff !== 0) return weekdayDiff
    return Number(prev.cs?.[0] || 0) - Number(next.cs?.[0] || 0)
  })
}

const sortNotes = notes => {
  return [...(notes || [])].sort((prev, next) => (prev.sortOrder || 0) - (next.sortOrder || 0))
}

const normalizeStoredNote = (note = {}, index = 0) => ({
  noteId: note.noteId || uuidV4(),
  title: `${note.title || ''}`.slice(0, 40),
  content: `${note.content || ''}`.slice(0, COURSE_REMARK_MAX_LENGTH),
  sortOrder: typeof note.sortOrder === 'number' ? note.sortOrder : index,
  createdAt: note.createdAt || Date.now(),
  updatedAt: note.updatedAt || note.createdAt || Date.now(),
})

const normalizeStoredTimeGroup = (timeGroup = {}, index = 0) => {
  const normalizedTimeGroup = toRemarkTimeGroup(timeGroup)

  return {
    ...normalizedTimeGroup,
    sortOrder: typeof timeGroup.sortOrder === 'number' ? timeGroup.sortOrder : index,
    notes: sortNotes((timeGroup.notes || []).map(normalizeStoredNote)),
  }
}

const getRemarkFilePath = () => `${wx.env.USER_DATA_PATH}/${COURSE_REMARK_STORAGE_KEY.replace(':', '_')}.json`

const saveRemarkMapToFile = (remarkMap) => {
  if (typeof wx === 'undefined') {
    uni.setStorageSync(COURSE_REMARK_STORAGE_KEY, JSON.stringify(remarkMap))
    return
  }
  try {
    const fs = wx.getFileSystemManager()
    fs.writeFileSync(getRemarkFilePath(), JSON.stringify(remarkMap), 'utf8')
  } catch (e) {
    console.error('Save to file system failed', e)
  }
}

export const getCourseRemarkMap = () => {
  if (typeof wx === 'undefined') {
    return getStorageSync(COURSE_REMARK_STORAGE_KEY, {}, true)
  }
  
  try {
    const fs = wx.getFileSystemManager()
    const filePath = getRemarkFilePath()
    fs.accessSync(filePath)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContent) || {}
  } catch (e) {
    // 降级：如果文件不存在，可能是老版本数据，尝试从 storage 读取并迁移
    const oldData = uni.getStorageSync(COURSE_REMARK_STORAGE_KEY)
    let parsedData = {}
    if (oldData) {
      try {
        parsedData = typeof oldData === 'string' ? JSON.parse(oldData) : oldData
        // 立即迁移到文件系统
        if (Object.keys(parsedData).length > 0) {
          saveRemarkMapToFile(parsedData)
        }
      } catch (err) {
        parsedData = {}
      }
    }
    return parsedData
  }
}

export const getCourseRemark = courseKey => {
  if (!courseKey) return undefined
  return getCourseRemarkMap()[courseKey]
}

const createCourseGroupFromSource = (course = {}) => ({
  courseKey: createCourseRemarkKey(course),
  cn: course.cn || '未命名课程',
  tn: course.tn || '',
  id: course.id,
  timeGroups: [],
})

export const getRemarkCourseList = schedule => {
  if (!Array.isArray(schedule)) return []

  const courseMap = new Map()

  schedule.forEach(weekItem => {
    if (!Array.isArray(weekItem)) return

    weekItem.slice(0, 7).forEach((dayItem, dayIndex) => {
      if (!Array.isArray(dayItem)) return

      dayItem.forEach(course => {
        if (!course || !course.cn) return

        const normalizedCourse = {
          ...course,
          wd: typeof course.wd === 'number' ? course.wd : dayIndex,
        }
        const courseKey = createCourseRemarkKey(normalizedCourse)
        const timeGroup = toRemarkTimeGroup(normalizedCourse)

        if (!courseMap.has(courseKey)) {
          courseMap.set(courseKey, createCourseGroupFromSource(normalizedCourse))
        }

        const currentCourse = courseMap.get(courseKey)
        if (!currentCourse.timeGroups.some(item => item.timeGroupKey === timeGroup.timeGroupKey)) {
          currentCourse.timeGroups.push(timeGroup)
        }
      })
    })
  })

  return Array.from(courseMap.values()).map(course => ({
    ...course,
    timeGroups: sortTimeGroups(course.timeGroups).map((item, index) => ({
      ...item,
      sortOrder: index,
      notes: [],
    })),
  }))
}

export const mergeRemarkCourseList = schedule => {
  const scheduleCourseList = getRemarkCourseList(schedule)
  const remarkMap = getCourseRemarkMap()

  return scheduleCourseList.map(course => {
    const remarkRecord = remarkMap[course.courseKey]
    if (!remarkRecord) {
      return course
    }

    const currentTimeGroupMap = new Map((course.timeGroups || []).map(item => [item.timeGroupKey, item]))

    ;(remarkRecord.timeGroups || []).forEach((timeGroup, index) => {
      const normalizedTimeGroup = normalizeStoredTimeGroup(timeGroup, index)
      const existingGroup = currentTimeGroupMap.get(normalizedTimeGroup.timeGroupKey)
      if (!existingGroup) return

      currentTimeGroupMap.set(normalizedTimeGroup.timeGroupKey, {
        ...existingGroup,
        ...normalizedTimeGroup,
        notes: normalizedTimeGroup.notes,
      })
    })

    return {
      ...course,
      timeGroups: sortTimeGroups(Array.from(currentTimeGroupMap.values())),
    }
  })
}

export const getRemarkCourseDetail = (schedule, courseKey) => {
  return mergeRemarkCourseList(schedule).find(item => item.courseKey === courseKey)
}

export const createCourseRemarkPreview = remarkCourse => {
  const firstNote = remarkCourse?.timeGroups?.flatMap(item => item.notes || []).find(item => item.content)
  return firstNote?.content ? firstNote.content.slice(0, 36) : ''
}

export const getCourseRemarkCount = remarkCourse => {
  return (remarkCourse?.timeGroups || []).reduce((total, item) => total + (item.notes?.length || 0), 0)
}

export const buildSearchResultGroups = (courseList, keyword) => {
  const normalizedKeyword = `${keyword || ''}`.trim().toLowerCase()
  if (!normalizedKeyword) return []

  const resultGroups = []

  courseList.forEach(course => {
    ;(course.timeGroups || []).forEach(timeGroup => {
      const groupFields = [
        course.cn,
        course.tn,
        timeGroup.weekdayText,
        timeGroup.timeText,
        timeGroup.ad,
      ]
        .join(' ')
        .toLowerCase()

      const matchedNotes = (timeGroup.notes || []).filter(note => {
        const noteFields = `${groupFields} ${note.content || ''}`
        return noteFields.includes(normalizedKeyword)
      })

      if (!matchedNotes.length && !groupFields.includes(normalizedKeyword)) {
        return
      }

      const items = (matchedNotes.length ? matchedNotes : timeGroup.notes || []).map(note => ({
        courseKey: course.courseKey,
        courseName: course.cn,
        teacher: course.tn,
        timeGroupKey: timeGroup.timeGroupKey,
        noteId: note.noteId,
        content: note.content,
        weekdayText: timeGroup.weekdayText,
        timeText: timeGroup.timeText,
        address: timeGroup.ad,
      }))

      if (!items.length) {
        return
      }

      resultGroups.push({
        groupKey: `${course.courseKey}::${timeGroup.timeGroupKey}`,
        title: `${course.cn}${course.tn ? ` / ${course.tn}` : ''}`,
        subtitle: [timeGroup.weekdayText, timeGroup.timeText, timeGroup.ad].filter(Boolean).join(' / '),
        items,
      })
    })
  })

  return resultGroups
}

// ======================= 新增：URL 识别解析方法 =======================
export const parseTextWithLinks = (text) => {
  if (!text) return []
  
  // 识别 http:// 或 https:// 开头的 URL
  const urlRegex = /(https?:\/\/[^\s\u4e00-\u9fa5]+)/gi
  const parts = text.split(urlRegex)
  const result = []
  
  parts.forEach(part => {
    if (!part) return
    if (urlRegex.test(part)) {
      result.push({ type: 'link', content: part })
    } else {
      result.push({ type: 'text', content: part })
    }
  })
  
  return result
}
// ====================================================================

export const saveRemarkCourseDetail = courseDetail => {
  if (!courseDetail?.courseKey) return

  const remarkMap = getCourseRemarkMap()
  const normalizedTimeGroups = (courseDetail.timeGroups || [])
    .map((timeGroup, timeGroupIndex) => ({
      ...normalizeStoredTimeGroup(timeGroup, timeGroupIndex),
      notes: sortNotes(
        (timeGroup.notes || [])
          .map((note, noteIndex) => ({
            ...normalizeStoredNote(note, noteIndex),
            title: `${note.title || ''}`.slice(0, 40),
            content: `${note.content || ''}`.slice(0, COURSE_REMARK_MAX_LENGTH),
            sortOrder: noteIndex,
            updatedAt: note.updatedAt || Date.now(),
          }))
          .filter(note => note.content.trim())
      ),
    }))
    .filter(timeGroup => timeGroup.notes.length)

  if (!normalizedTimeGroups.length) {
    delete remarkMap[courseDetail.courseKey]
    saveRemarkMapToFile(remarkMap)
    return
  }

  remarkMap[courseDetail.courseKey] = {
    updatedAt: Date.now(),
    courseSnapshot: {
      cn: courseDetail.cn || '',
      tn: courseDetail.tn || '',
      id: courseDetail.id,
    },
    timeGroups: normalizedTimeGroups,
  }

  saveRemarkMapToFile(remarkMap)
}


export const exportSingleRemarkNote = (courseName, timeText, note) => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))
    
    try {
      const fs = wx.getFileSystemManager()
      const fileName = `【课程备注】${courseName}_${timeText}.txt`.replace(/[/\\?%*:|"<>]/g, '_')
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
      
      const exportData = {
        _isSingleNote: true, // 标识为单条备注
        courseName,
        timeText,
        note: {
          title: note.title,
          content: note.content,
        }
      }
      
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), 'utf8')

      wx.shareFileMessage({
        filePath: filePath,
        fileName: fileName,
        success: resolve,
        fail: reject
      })
    } catch (e) {
      console.error('Export single note failed', e)
      reject(e)
    }
  })
}

export const importSingleRemarkNote = () => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json', 'txt'],
      success(res) {
        const tempFilePath = res.tempFiles[0].path
        try {
          const fs = wx.getFileSystemManager()
          const fileContent = fs.readFileSync(tempFilePath, 'utf8')
          const importedData = JSON.parse(fileContent)

          if (!importedData || !importedData._isSingleNote || !importedData.note) {
            throw new Error('不是有效的单条备注文件')
          }

          resolve(importedData.note)
        } catch (e) {
          uni.showToast({ title: '无法识别该备注文件', icon: 'none' })
          reject(e)
        }
      },
      fail: reject
    })
  })
}

export const exportRemarkData = () => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))
    
    const filePath = getRemarkFilePath()
    try {
      const fs = wx.getFileSystemManager()
      fs.accessSync(filePath)
    } catch (e) {
      // 如果文件不存在，强制生成一次
      saveRemarkMapToFile(getCourseRemarkMap())
    }

    wx.shareFileMessage({
      filePath: filePath,
      fileName: 'gdutday_remarks_backup.json',
      success: resolve,
      fail: reject
    })
  })
}

export const importRemarkData = () => {
  return new Promise((resolve, reject) => {
    if (typeof wx === 'undefined') return reject(new Error('请在微信小程序环境中使用'))

    wx.chooseMessageFile({
      count: 1,
      type: 'file', // 微信会严格过滤这个扩展名，部分安卓/iOS不识别.json
      extension: ['json', 'txt'], // 增加 .txt 兼容性
      success(res) {
        const tempFilePath = res.tempFiles[0].path
        try {
          const fs = wx.getFileSystemManager()
          const fileContent = fs.readFileSync(tempFilePath, 'utf8')
          const importedData = JSON.parse(fileContent)

          if (!importedData || typeof importedData !== 'object' || Array.isArray(importedData)) {
            throw new Error('JSON 格式不正确')
          }

          // 合并数据（以导入的数据为主）
          const currentData = getCourseRemarkMap()
          const mergedData = { ...currentData, ...importedData }
          saveRemarkMapToFile(mergedData)
          
          uni.showToast({ title: '导入成功', icon: 'success' })
          resolve(mergedData)
        } catch (e) {
          uni.showToast({ title: '数据格式错误', icon: 'none' })
          reject(e)
        }
      },
      fail: reject
    })
  })
}
