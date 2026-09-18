// [ai-mode:static] 来自 src/utils/convert/student-v2/schedule.js
// 将 V3 API 的新格式数据转换为旧格式（字段名映射）

const newToOldDict = {
  'coursePlace': 'ad',
  'courseName': 'cn',
  'courseTeacher': 'tn',
  'courseDay': 'wd',
  'courseWeek': 'w',
  'courseDescription': 'cc',
  'courseSection': 'cs',
  'id': 'id',
}

function convertSingleCourseToOld(newCourse) {
  var result = {}
  for (var key in newToOldDict) {
    if (newCourse[key] !== undefined) {
      result[newToOldDict[key]] = newCourse[key]
    }
  }
  return result
}

function convertCourseArrayToOld(arr) {
  return arr.map(convertSingleCourseToOld)
}

function convertToOldCourseData(newData) {
  var result = {}
  for (var key in newData) {
    result[key] = convertCourseArrayToOld(newData[key])
  }
  return result
}

// 生成课程 ID 字典
function generateCourseIdDict(courseData) {
  var names = []
  for (var key in courseData) {
    var courses = courseData[key]
    for (var i = 0; i < courses.length; i++) {
      var name = courses[i].courseName || courses[i].cn
      if (name && names.indexOf(name) === -1) {
        names.push(name)
      }
    }
  }
  names.sort(function (a, b) { return a.localeCompare(b) })
  var dict = {}
  for (var j = 0; j < names.length; j++) {
    dict[names[j]] = j
  }
  return dict
}

function addIdInCourseArray(courseArray, dict) {
  return courseArray.map(function (c) {
    var id = dict[c.courseName || c.cn]
    var copy = {}
    for (var k in c) copy[k] = c[k]
    copy.id = id
    return copy
  })
}

function addIdInCourseData(courseData) {
  var dict = generateCourseIdDict(courseData)
  var result = {}
  for (var key in courseData) {
    result[key] = addIdInCourseArray(courseData[key], dict)
  }
  return result
}

function scheduleV2Adaptor(rawData) {
  var withId = addIdInCourseData(rawData)
  return convertToOldCourseData(withId)
}

module.exports = {
  scheduleV2Adaptor,
  addIdInCourseData,
  convertToOldCourseData,
}
