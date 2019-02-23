import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/start',
      name: 'Start',
      component: () => import('./views/Start.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
