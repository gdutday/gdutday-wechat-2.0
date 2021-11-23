export default {
  namespaced: true,
  state:() => ({
    currentWeek:uni.getStorageSync('currentWeek'),//是获取的目前的周数，不改变
    pickWeek:uni.getStorageSync('currentWeek')? uni.getStorageSync('currentWeek'): 0,//自己切换的week，随时可以改变
    pickWeekSchedule:[],
    allWeeks:[],
    nowWeeks:[],
  }),
  getters: {
    getCurrentWeek(state) {
          return state.currentWeek
      },     
  },
  mutations: {
    setCurrentWeek(state,{currentWeek}) {
      state.currentWeek = currentWeek;
      uni.setStorageSync('currentWeek', currentWeek);
    },
    setPickWeek(state,payload){
      state.pickWeek = payload.pickWeek;
      state.nowWeeks = state.allWeeks[state.pickWeek];
    },

    setAllWeeks(state,payload){
      state.allWeeks = payload.allWeeks;
    },
    setPickWeekSchedule(state, payload){
      state.pickWeekSchedule = payload.pickWeekSchedule;
      uni.setStorageSync('pickWeekSchedule', payload.pickWeekSchedule)
    }
  }
}
