export default {
  namespaced: true,
  state:() => ({
    currentThemeName:'',
    curBg:'',
    curTextC:''
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
    }
  }

}