import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/ProjectList'),
          meta: {
            title: 'Projects'
          }
        },
        {
          path: '/project/:projectId',
          name: 'project',
          component: () => import('./views/Project')
        }
      ]
    }
  ]
})
