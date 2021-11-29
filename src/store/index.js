import { createStore } from 'vuex'
import theme from './modules/theme'
import navInfo from './modules/navInfo'
import scheduleInfo from './modules/scheduleInfo'
import common from './modules/common'
export default createStore({
  modules:{
    common,
    theme,
    navInfo,
    scheduleInfo,
  },
})