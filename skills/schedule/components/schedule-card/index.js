// components/schedule-card/index.js
Component({
  data: {
    date: '',
    weekday: '',
    weekNumber: 0,
    courses: [],
    totalCount: 0,
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] schedule-card created')

      const { NotificationType } = wx.modelContext

      // 监听接口返回结果
      const modelCtx = wx.modelContext.getContext(this)
      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data.result && data.result.structuredContent
        console.info('[ai-mode] schedule-card 收到 Result:', JSON.stringify(sc))
        if (!sc) return

        const courses = (sc.courses || []).map((course) => ({
          courseName: course.courseName || '',
          courseTeacher: course.courseTeacher || '',
          coursePlace: course.coursePlace || '',
          courseTime: course.courseTime || '',
          courseSection: course.courseSection || [],
          courseColor: course.courseColor || '#DB2777',
        }))

        this.setData({
          date: sc.date || '',
          weekday: sc.weekday || '',
          weekNumber: sc.weekNumber || 0,
          courses: courses,
          totalCount: courses.length,
        })
        console.info('[ai-mode] schedule-card setData totalCount=' + courses.length)
      })

      // 容器尺寸 + 溢出监听
      const viewCtx = wx.modelContext.getViewContext(this)
      const { minHeight, maxHeight, width } = viewCtx.getDimensions()
      console.info('[ai-mode] schedule-card dimensions width=' + width + ' minHeight=' + minHeight + ' maxHeight=' + maxHeight)

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info(
          '[ai-mode] schedule-card overflow overflowed=' + overflowed +
          ' data=' + JSON.stringify(data)
        )
      })
      console.info('[ai-mode] schedule-card overflow monitor=on')
    },
  },
  methods: {
    _sendText(text) {
      console.info('[ai-mode] schedule-card send text=' + text)
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [{ type: 'text', text: text }],
      })
    },
    onTapCourse(e) {
      const name = e.currentTarget.dataset.name || ''
      if (name) {
        this._sendText('查看 ' + name + ' 的详情')
      }
    },
  },
})
