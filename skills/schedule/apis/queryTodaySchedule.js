// [ai-mode:static] API POST /v3/schedule 来自 src/network/ssxRequest/request-v2/schedule.js:3
// [ai-mode:static] 登录 POST /v3/login 来自 src/network/ssxRequest/request-v2/login.js:3
// [ai-mode:static] 参数: { userType, termId, loginType, cookies }
// [ai-mode:static] 响应字段: data[weekNum][] = { coursePlace, courseName, courseTeacher, courseDay, courseWeek, courseSection, id }

const { errorResult, successResult, request, ensureLogin, filterSchedule, getClassTime, getCourseColor, getCurrentWeek } = require('../utils/util')
const { scheduleV2Adaptor } = require('../utils/convert')
const { USER_TYPE, LOGIN_TYPE } = require('../utils/enum')

/**
 * 查询今日课表
 * 自动获取当前学期、周数，返回当天所有课程信息
 */
async function queryTodaySchedule(params) {
  console.info('[ai-mode] queryTodaySchedule 入口, params=', JSON.stringify(params))

  try {
    // 1. 确保登录态
    await ensureLogin()

    // 2. 获取当前学期和周数
    const userType = wx.getStorageSync('userType') || USER_TYPE.undergraduate
    const loginType = wx.getStorageSync('loginType') || LOGIN_TYPE.loginV2
    const termId = wx.getStorageSync('selectedTermId') || ''
    const currentWeek = getCurrentWeek()

    console.info(`[ai-mode] queryTodaySchedule userType=${userType} termId=${termId} currentWeek=${currentWeek}`)

    // 3. 请求课表数据
    const reqBody = {
      userType: userType,
      termId: termId,
      loginType: loginType,
      cookies: wx.getStorageSync('weCookies') || '',
    }

    console.info('[ai-mode] queryTodaySchedule 请求课表接口')
    const res = await request({
      url: '/schedule',
      method: 'POST',
      data: reqBody,
    })

    console.info('[ai-mode] queryTodaySchedule 接口响应 code=', res.code)

    if (res.code !== 200) {
      return errorResult('课表查询失败: 接口返回错误')
    }

    const rawData = res.data
    if (!rawData) {
      return errorResult('课表数据为空，可能未选择学期')
    }

    // 4. 数据转换: V3新格式 → 旧格式
    const oldData = scheduleV2Adaptor(rawData)

    // 5. 过滤和分组: 按周分、按天排
    const { weeksData, scheduleIdColor } = filterSchedule(oldData)

    console.info(`[ai-mode] queryTodaySchedule weeksData length=${weeksData.length}`)

    // 6. 提取今天(当前周当前日)的课程
    // currentWeek: 0-19, getDay(): 0=周日,1=周一,...6=周六
    if (currentWeek >= weeksData.length) {
      return errorResult('当前周数超出学期范围，请检查开学日期设置')
    }

    const weekData = weeksData[currentWeek] // [周一[], 周二[], ..., 周日[], weekIndex]
    const jsDay = new Date().getDay() // 0=周日
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1 // 映射到 weeksData 索引: 0=周一

    const todayCourses = weekData[dayIndex] || []

    // 7. 整理返回数据
    const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

    const courses = todayCourses.map(function (course) {
      const cs = Array.isArray(course.cs) ? course.cs : []
      const timeStr = cs.length > 0 ? getClassTime(cs) : ''
      return {
        courseName: course.cn || '',
        courseTeacher: course.tn || '',
        coursePlace: course.ad || '',
        courseTime: timeStr,
        courseSection: cs,
        courseColor: getCourseColor(course.id, scheduleIdColor),
      }
    })

    // 按节次排序
    courses.sort(function (a, b) {
      var aStart = a.courseSection.length > 0 ? Number(a.courseSection[0]) : 99
      var bStart = b.courseSection.length > 0 ? Number(b.courseSection[0]) : 99
      return aStart - bStart
    })

    console.info(`[ai-mode] queryTodaySchedule 今日 ${todayCourses.length} 节课`)

    return successResult(
      todayCourses.length > 0
        ? '今天有 ' + todayCourses.length + ' 节课'
        : '今天没有课程',
      {
        date: new Date().toLocaleDateString('zh-CN'),
        weekday: weekDayNames[dayIndex],
        weekNumber: currentWeek + 1,
        courses: courses,
        totalCount: courses.length,
      }
    )

  } catch (err) {
    console.error('[ai-mode] queryTodaySchedule 出错:', err.message)
    return errorResult('查询今日课表失败: ' + err.message)
  }
}

module.exports = { queryTodaySchedule }
