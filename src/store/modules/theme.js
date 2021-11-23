export default {
  //namespaced: true,
  state:() => ({
    curThemeType: 'dark',    
  }),
  getters: {
      getCurThemeType(state) {
          return state.curThemeType
      },     
  },
  mutations: {
      setCurThemeType(state,data) {
          state.curThemeType = data
          uni.setStorageSync('curThemeType', state.curThemeType)
      },     
  }

}