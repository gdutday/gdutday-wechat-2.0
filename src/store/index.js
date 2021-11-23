import { createStore } from 'vuex'
import theme from './modules/theme'
import navInfo from './modules/navInfo'
import scheduleInfo from './modules/scheduleInfo'
export default createStore({
  modules:{
    theme,
    navInfo,
    scheduleInfo
  },
})