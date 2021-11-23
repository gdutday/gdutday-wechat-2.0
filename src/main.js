import {
    createApp
} from 'vue'
import App from './App.vue'
import store from './store/index'
import themeMixin from './utils/mixinTheme'

const app = createApp(App).use(store).mixin(themeMixin).mount();
