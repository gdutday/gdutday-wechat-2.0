// [ai-mode:static] 来自 src/utils/common.js + src/hooks/ (经过 wx.request 适配)
const CryptoJS = require('./crypto-js')
const CRYPTO_KEY = 'gdutdingzhendays'
const { REQUEST_CLIENT_ERROR, getErrorMsgByCode } = require('./enum')
const { USER_TYPE, LOGIN_TYPE, UG_V1, UG_V2 } = require('./enum')

// ============ 必选：返回值工厂 ============

function errorResult(msg) {
  return { isError: true, content: [{ type: 'text', text: msg }] }
}

function successResult(msg, structuredContent) {
  const result = { isError: false, content: [{ type: 'text', text: msg }] }
  if (structuredContent !== undefined) result.structuredContent = structuredContent
  return result
}

// ============ HTTP 请求 ============

const BASE_URL = 'https://gdutdays.gdutelc.com/v3'

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: BASE_URL + options.url,
      header: Object.assign(
        { 'Content-Type': 'application/json' },
        options.header || {}
      ),
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error('HTTP ' + res.statusCode))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// ============ 登录鉴权 ============

let _weCookies = ''
let _loginPromise = null

// AES 加密 (ECB, Pkcs7)
function graduteEncoding(key, text) {
  var keyBytes = CryptoJS.enc.Utf8.parse(CRYPTO_KEY)
  var textBytes = CryptoJS.enc.Utf8.parse(text)
  var encrypted = CryptoJS.AES.encrypt(textBytes, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext).toString()
}

function ensureLogin() {
  if (_loginPromise) return _loginPromise

  _loginPromise = (async () => {
    console.info('[ai-mode] ensureLogin 开始')
    try {
      const username = wx.getStorageSync('username') || ''
      const password = wx.getStorageSync('password') || ''

      if (!username || !password) {
        console.error('[ai-mode] ensureLogin 缺少用户名或密码')
        _loginPromise = null
        throw new Error('请先在小程序中登录（需要用户名和密码）')
      }

      const userType = wx.getStorageSync('userType') || USER_TYPE.undergraduate
      const loginType = wx.getStorageSync('loginType') || LOGIN_TYPE.loginV2

      const encodedPassword = graduteEncoding(username, password)

      const body = {
        user: username,
        password: encodedPassword,
        userType: userType,
        loginType: loginType,
      }

      console.info('[ai-mode] ensureLogin 发起登录请求')
      const res = await request({
        url: '/login',
        method: 'POST',
        data: body,
      })

      if (res.code !== 200) {
        throw new Error(getErrorMsgByCode(res.code) || '登录失败')
      }

      _weCookies = res.data && res.data.weCookies ? res.data.weCookies : ''
      console.info('[ai-mode] ensureLogin 登录成功, weCookies length=', (_weCookies || '').length)
    } catch (e) {
      _loginPromise = null
      console.error('[ai-mode] ensureLogin 失败:', e.message)
      throw e
    }
  })()

  return _loginPromise
}

// ============ 课表数据处理 ============

// 课程颜色表
const classColor = [
  '#96a48b', '#F8BBD0', '#c1cbd7', '#eee5f8', '#fbead4', '#C5CAE9',
  '#fcfaed', '#FFCCBC', '#b6c4b2', '#7c7d6b', '#c7b6a5', '#ebeae8',
  '#d3d2ce', '#e1cccf', '#ead0d4', '#92abd3', '#f6e9d9', '#54697a',
]

// 节次时间表 (大学城校区)
const classTimeTable = [
  ['8:30', '9:15'],
  ['9:20', '10:05'],
  ['10:25', '11:10'],
  ['11:15', '12:00'],
  ['13:50', '14:35'],
  ['14:40', '15:25'],
  ['15:30', '16:15'],
  ['16:30', '17:15'],
  ['17:20', '18:05'],
  ['18:30', '19:15'],
  ['19:20', '20:05'],
  ['20:10', '20:55'],
]

function commitScheduleColor(classesId) {
  let filtered = classColor.filter((item, index) => index < classesId.length)
  return filtered.map((color, index) => ({
    color: color,
    class: classesId[index],
  }))
}

function getAllValuesSet(arr) {
  return Array.from(new Set(arr))
}

// 分配课程颜色
function getCourseColor(courseId, scheduleIdColor) {
  if (!scheduleIdColor) return '#DB2777'
  for (let i = 0; i < scheduleIdColor.length; i++) {
    if (scheduleIdColor[i].class == courseId) {
      return scheduleIdColor[i].color
    }
  }
  return '#DB2777'
}

// 获取节次对应时间
function getClassTime(classSection) {
  let sT = classSection.map(function (ele) {
    return +ele < 10 ? ele.slice(-1) : ele
  })
  let beginIndex = sT[0] - 1
  let endIndex = sT[sT.length - 1] - 1
  if (beginIndex < 0 || endIndex >= classTimeTable.length) return ''
  return classTimeTable[beginIndex][0] + '-' + classTimeTable[endIndex][1]
}

// 从 scheduleInfo(按周索引) 转为按 周日 分组的 weeksData
function filterSchedule(scheduleInfo) {
  let weeksData = []
  for (let i = 1; i < 21; i++) {
    let arr = [[], [], [], [], [], [], []] // 周一~周日
    let weekCourses = scheduleInfo[i]
    if (weekCourses) {
      for (let j = 0; j < weekCourses.length; j++) {
        let info = weekCourses[j]
        if (info && info.wd) {
          arr[--info.wd].push(info) // wd 1-7 → arr 0-6
        }
      }
    }
    arr.push(i) // 最后一格存周数
    weeksData.push(arr)
  }

  // 收集所有 course id 用于颜色分配
  let allIds = []
  for (let i = 0; i < weeksData.length; i++) {
    for (let j = 0; j < weeksData[i].length - 1; j++) {
      for (let k = 0; k < weeksData[i][j].length; k++) {
        if (weeksData[i][j][k].cs) {
          weeksData[i][j][k].cs = weeksData[i][j][k].cs.split(',')
          allIds.push(weeksData[i][j][k].id)
        }
      }
    }
  }

  let scheduleIdColor = commitScheduleColor(getAllValuesSet(allIds))
  return { weeksData, scheduleIdColor }
}

// 计算当前周数（基于 schoolOpening）
function getCurrentWeek() {
  let termStart = wx.getStorageSync('schoolOpening')
  if (!termStart) {
    // 默认开学日期
    termStart = '2025.2.24'
  }
  const platform = wx.getStorageSync('platform') || ''
  const separator = platform === 'ios' ? '/' : '.'
  const normalized = termStart.replace(/[.\/\-]/g, separator)
  const parts = normalized.split(separator)
  const startDate = new Date(parts[0], parts[1] - 1, parts[2])
  const now = new Date()
  const diff = now.getTime() - startDate.getTime()
  const week = Math.floor(diff / 604800000)
  if (week < 0) return 0
  if (week > 19) return 0
  return week
}

module.exports = {
  errorResult,
  successResult,
  request,
  ensureLogin,
  graduteEncoding,
  filterSchedule,
  getClassTime,
  getCourseColor,
  getCurrentWeek,
  BASE_URL,
}
