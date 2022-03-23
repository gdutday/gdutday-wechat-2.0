export default {
  namespaced: true,
  state:() => ({
    currentWeek:uni.getStorageSync('currentWeek'),//是获取的目前的周数，不改变
    pickWeek:uni.getStorageSync('currentWeek')? uni.getStorageSync('currentWeek'): 0,//自己切换的week，随时可以改变
    pickWeekSchedule:[],
    currentSwiperIndex:0,//用于记录目前轮播图的状态
    schedule:uni.getStorageSync('weeksData')?uni.getStorageSync('weeksData'):[],
    allWeeks:[],
    nowWeeks:[],
    isShow:false,//遮罩层是否显示
    modalType:'',
    showedScheduleInfo:{},
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
    },
    setCurrentSwiperIndex(state,payload){
      state.currentSwiperIndex = payload.currentSwiperIndex;
    },
    setSchedule(state, payload){
      state.schedule = payload.schedule;
    },
    setIsShow(state,payload){
      state.isShow = payload.isShow;
    },
    setShowedScheduleInfo(state,payload){
      state.showedScheduleInfo = payload.showedScheduleInfo
    },
    setModalType(state, payload){
      state.modalType = payload.modalType;
      console.log(payload.modalType);
      console.log(state.modalType);
    }
  }
}
