import Vue from 'vue'
import clickoutside from 'element-ui/src/utils/clickoutside'
import showdown from 'showdown'

Vue.directive('clickoutside', clickoutside)

Vue.directive('autofocus', {
  bind (el) {
    const input = el.querySelector('input, textarea')
    setTimeout(() => input && input.focus(), 0)
  }
})

const mdConverter = new showdown.Converter({
  tasklists: true,
  tables: true
})
mdConverter.setFlavor('github')
Vue.directive('marked', {
  bind (el, binding) {
    el.innerHTML = mdConverter.makeHtml(binding.value)
  },
  update (el, binding) {
    el.innerHTML = mdConverter.makeHtml(binding.value)
  }
})
