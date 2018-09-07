import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.component('fa-icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
