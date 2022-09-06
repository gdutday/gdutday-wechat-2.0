import { getStorageSync } from '@/utils/common'

export default {
  namespaced: true,
  state: () => ({
    currentWeek: uni.getStorageSync('currentWeek'), //是获取的目前的周数，不改变
    pickWeek: uni.getStorageSync('currentWeek') ? uni.getStorageSync('currentWeek') : 0, //自己切换的week，随时可以改变
    pickWeekSchedule: [],
    currentSwiperIndex: 0, //用于记录目前轮播图的状态
    schedule: uni.getStorageSync('weeksData') ? uni.getStorageSync('weeksData') : [],
    allWeeks: [],
    nowWeeks: [],
    isShow: false, //遮罩层是否显示
    modalType: '',
    showedScheduleInfo: {},
    userDefinedClasses: getStorageSync('userDefinedClasses') ? getStorageSync('userDefinedClasses') : {},
  }),
  getters: {
    getCurrentWeek(state) {
      return state.currentWeek
    },
  },
  mutations: {
    setCurrentWeek(state, { currentWeek }) {
      state.currentWeek = currentWeek
      uni.setStorageSync('currentWeek', currentWeek)
    },
    setPickWeek(state, payload) {
      state.pickWeek = payload.pickWeek
      state.nowWeeks = state.allWeeks[state.pickWeek]
    },
    setAllWeeks(state, payload) {
      state.allWeeks = payload.allWeeks
    },
    setPickWeekSchedule(state, payload) {
      state.pickWeekSchedule = payload.pickWeekSchedule
      uni.setStorageSync('pickWeekSchedule', payload.pickWeekSchedule)
    },
    setCurrentSwiperIndex(state, payload) {
      state.currentSwiperIndex = payload.currentSwiperIndex
    },
    setSchedule(state, payload) {
      state.schedule = payload.schedule
    },
    setIsShow(state, payload) {
      state.isShow = payload.isShow
    },
    setShowedScheduleInfo(state, payload) {
      state.showedScheduleInfo = payload.showedScheduleInfo
    },
    setModalType(state, payload) {
      state.modalType = payload.modalType
    },
    setUserDefinedClasses(state, payload) {
      const { id } = payload
      state.userDefinedClasses[id] = { ...payload }
      uni.setStorageSync('userDefinedClasses', state.userDefinedClasses)
    },
    refreshUserDefinedClasses(state, payload) {
      const { id, ...userDefinedClasses } = payload
      state.userDefinedClasses = { ...userDefinedClasses }
      uni.setStorageSync('userDefinedClasses', state.userDefinedClasses)
      handleClassesDelete(state.schedule, id)
      console.log(state.schedule)
    },
    insertNewClass(state, payload) {
      const { weeks, ...scheduleInfo } = payload
      handleNewClassInsert(state.schedule, weeks, scheduleInfo)
    },
  },
}

function handleNewClassInsert(schedule, weeksList, scheduleInfo) {
  try {
    if (!weeksList || !scheduleInfo) throw new Error('error')

    schedule.forEach((scheduleItem, scheduleIndex) => {
      //console.log(scheduleItem, scheduleIndex)
      if (weeksList[scheduleIndex]) {
        const { wd } = scheduleInfo // 获取到底是周几？ 0：周一
        scheduleItem[wd].push({
          ...scheduleInfo,
          w: scheduleIndex + 1 + '',
        })
      }
    })
    return schedule
  } catch (error) {
    console.log(error)
  }
}

function handleClassesDelete(schedule, id) {
  // 根据id进行删除
  schedule.forEach(weeks => {
    console.log(weeks)
    weeks.forEach(days => {
      if (Array.isArray(days))
        days.forEach((classInfo, index) => {
          if (classInfo.id === id) {
            days.splice(index, 1)
          }
        })
    })
  })
}
