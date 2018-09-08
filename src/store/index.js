import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    projects: {},
    taskLists: {},
    tasks: {}
  },
  mutations: require('./mutations').default,
  actions: require('./actions').default,
  getters: require('./getters').default
})

export default store

if (module.hot) {
  module.hot.accept(['./mutations', './actions'], () => {
    const mutations = require('./mutations').default
    const actions = require('./actions').default
    const getters = require('./getters').default

    store.hotUpdate({
      mutations,
      actions,
      getters
    })
  })
}
