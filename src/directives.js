import Vue from 'vue'
import clickoutside from 'element-ui/src/utils/clickoutside'

Vue.directive('clickoutside', clickoutside)

Vue.directive('autofocus', {
  bind (el) {
    const input = el.querySelector('input')
    setTimeout(() => input && input.focus(), 0)
  }
})
