import { computed, reactive, ref } from 'vue'
import { WEEKDAYS, CLASS_SECTIONS, CLASS_CONTINUE } from './config'
import { uuidV4 } from '@/utils/common'
import { useStore } from 'vuex'
const selectorOptionsHook = () => {
  const store = useStore()
  const classInfoOpts = reactive({
    classname: '', // 课程名称
    address: '', // 课程地址
    classSection: [], // "["01","02"]"代表上课的节数
    weekday: 0, // 在周几上？周一:0
    weeks: new Array(20).fill(0), // 在哪几周上：1,第一周
    id: uuidV4(), // 唯一标识
  })

  const classStartIndex = ref(0)
  const classOptsTextResult = ref('请点击此处')
  const availableWeeksList = ref([])

  const classOptsRange = ref([WEEKDAYS, CLASS_SECTIONS, CLASS_CONTINUE])
  const controllClassOptsColumn = e => {
    const { column, value: choosenIndex } = e.detail
    console.log(column, choosenIndex)

    // 当宽度被控制的时候，需要调整第三列的课程时间
    if (column === 1) {
      classOptsRange.value[2] = CLASS_CONTINUE.slice(0, CLASS_CONTINUE.length - choosenIndex)
    }
    classInfoOpts.weeks = new Array(20).fill(0)
  }

  const changeClassOpts = e => {
    function getClassSection(start, len) {
      const ans = []

      for (let i = 0; i < len; i++) {
        let nowIndex = ++start
        nowIndex >= 10 ? ans.push('' + start) : ans.push('0' + start)
      }

      return ans
    }

    function handleResult(weekdayIndex, startIndex, continueIndex) {
      classInfoOpts.weekday = weekdayIndex
      classInfoOpts.classSection = getClassSection(startIndex, continueIndex + 1)
    }

    function getAvailableWeeksList(classList, currentConfig) {
      const { weekday: wd, classSection: cs } = currentConfig
      const classSectionSet = new Set()
      cs.forEach(csItem => classSectionSet.add(csItem))

      const exactWeekdayClassList = classList.map(week => week[wd]) // 返回一个新的List
      const ans = exactWeekdayClassList.map(everyWeekDay => {
        if (everyWeekDay.length >= 0) {
          // 如果这一天是有课的，遍历这一天的课
          let isHasCsItem = false
          everyWeekDay.forEach(schedule => {
            if (!isHasCsItem) isHasCsItem = schedule.cs.find(csItem => classSectionSet.has(csItem)) // 看看是否存在这一天，如果找到了设置为ture
          })
          return isHasCsItem ? false : true // 如果没课返回true，代表可以插入
        } else {
          return true
        }
      })
      return ans
    }

    const [weekdayIndex, startIndex, continueIndex] = e.detail.value

    // 处理
    handleResult(weekdayIndex, startIndex, continueIndex)
    // 输出文字版最终结果
    classOptsTextResult.value = `${classOptsRange.value[0][weekdayIndex]},${classOptsRange.value[1][startIndex]},${classOptsRange.value[2][continueIndex]}`
    // 判断哪几个week可用？
    const ans = getAvailableWeeksList(store.state.scheduleInfo.schedule, classInfoOpts)
    availableWeeksList.value = ans
  }

  const insertNewClass = () => {
    const obj = {
      cn: classInfoOpts.classname,
      cs: classInfoOpts.classSection,
      ad: classInfoOpts.address,
      id: classInfoOpts.id,
      wd: classInfoOpts.weekday,
      weeks: classInfoOpts.weeks,
    }
    store.commit('scheduleInfo/insertNewClass', obj)
    store.commit('scheduleInfo/setUserDefinedClasses', obj)
  }

  const insertScheduleWhileRefresh = () => {
    Object.values(store.state.scheduleInfo.userDefinedClasses).forEach((value, key) => {
      store.commit('scheduleInfo/insertNewClass', value)
    })
  }

  return {
    classInfoOpts,
    classOptsRange,
    classStartIndex,
    classOptsTextResult,
    controllClassOptsColumn,
    changeClassOpts,
    availableWeeksList,
    insertNewClass,
    insertScheduleWhileRefresh,
  }
}

export default selectorOptionsHook
