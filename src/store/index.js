import { createStore } from 'vuex'
import theme from './modules/theme'
import navInfo from './modules/navInfo'
import scheduleInfo from './modules/scheduleInfo'
import common from './modules/common';
import exam from './modules/exam';
import news from './modules/news'
export default createStore({
  modules:{
    common,
    theme,
    navInfo,
    scheduleInfo,
    exam,
    news
  },
})