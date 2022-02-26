export default {
  namespaced: true,
  state:() => ({
    currentThemeName:'',
    curBg:'',
    curBgSecond:'',
    curWarnColor:'',
    curTextC:'',
    opacity:uni.getStorageSync('opacity')?uni.getStorageSync('opacity'):0.9
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
    },
    setOpacity(store, payload){
      uni.setStorageSync('opacity', payload.opacity)
      store.opacity = payload.opacity;
    }
  }
}