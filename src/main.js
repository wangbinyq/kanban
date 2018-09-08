import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './directives'
import Element from 'element-ui'
import './styles/element-variables.scss'

Vue.config.productionTip = false
Vue.use(Element)

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
