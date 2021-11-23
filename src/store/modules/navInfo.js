export default {
  namespaced: true,
  state:() => ({
      themeColor:'',//主题颜色
      allHeight:'',//总高度
      zltHeight:'',//状态栏高度
      navHeight:'',//导航栏高度
      jnHeight:'',//胶囊高度
      wdHeight:'',//屏幕内可操作部分的高度,
      wdWidth:'',//屏幕里可操作部分的宽度（可以用于rpx转px）
  }),
  getters: {
      getCurThemeType(state) {
          return state.curThemeType
      },     
  },
  mutations: {
      setnavInfo(state,payload) {
        state.allHeight = payload.zltHeight + payload.navHeight;
        state.zltHeight = payload.zltHeight;
        state.navHeight = payload.navHeight;
        state.jnHeight = payload.jnHeight;
        state.wdHeight = payload.wdHeight;
        state.wdWidth = payload.wdWidth;
        uni.setStorageSync('navInfo', state);
      },     
  }
}
