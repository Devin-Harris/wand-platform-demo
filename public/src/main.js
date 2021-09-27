import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vueDebounce from 'vue-debounce'
import ClickOutside from 'vue-click-outside'

Vue.use(vueDebounce)
Vue.directive('click-outside', ClickOutside)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$mount('#app')
