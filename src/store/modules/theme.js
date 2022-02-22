export default {
  namespaced: true,
  state:() => ({
    currentThemeName:'',
    curBg:'',
    curBgSecond:'',
    curWarnColor:'',
    curTextC:'',
  }),
  getters: {
      getCurThemeType(state) {
          return state.curThemeType
      },     
  },
  mutations: {
    setCurrentThemeName(store,payload){
      store.currentThemeName = payload.currentThemeName
    },
    setCurrentThemeInfo(store,payload){
      store.curBg = payload.curBg,
      store.curTextC = payload.curTextC;
      store.curWarnColor = payload.curWarnColor;
      store.curBgSecond = payload.curBgSecond
    }
  }

}