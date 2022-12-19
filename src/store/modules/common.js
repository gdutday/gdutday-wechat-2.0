export default {
  namespaced: true,
  state:() => ({
    isLogin:uni.getStorageSync('isLogin')?uni.getStorageSync('isLogin'):false,//是获取的目前的周数，不改变
    //keyValue:0,
    toastIsShow:false,
    backgroundImage:uni.getStorageSync('backgroundImage') ? uni.getStorageSync('backgroundImage'): '',
	isGraduateStudent:uni.getStorageSync('isGraduateStudent')?uni.getStorageSync('isGraduateStudent'):false, // 是否是研究生
  }),

  mutations: {
    setIsLogin(state,payload) {
      state.isLogin = payload.isLogin;
      uni.setStorageSync('isLogin', payload.isLogin);
    },
    // setKeyValue(state,payload){
    //   state.keyValue=state.keyValue+1;
    //   console.log(state.keyValue);
    // },
    setToastIsShow(state,payload){
      state.toastIsShow = payload.toastIsShow;
    },
    setBackgroundImage(state, payload){
      state.backgroundImage = payload.backgroundImagePath;
    },
	/**
	 * 改变身份状态
	 * @param {Object} state
	 * @param {Object} payload
	 */
	setIsGraduateStudent(state,payload){
		state.isGraduateStudent=payload.isGraduateStudent;
		uni.setStorageSync('isGraduateStudent', payload.isGraduateStudent);
	}
  }
}
