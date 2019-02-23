import Vue from 'vue'
import Router from 'vue-router'

import { checkAuth } from './vue-apollo.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('./views/Profile.vue'),
      beforeEnter: (to, from, next) => {
        if (!checkAuth()) {
          return next({ name: 'Login' })
        }

        return next()
      }
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/start',
      name: 'Start',
      component: () => import('./views/Start.vue'),
      beforeEnter: (to, from, next) => {
        if (!checkAuth()) {
          return next({ name: 'Login' })
        }

        return next()
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('./views/Settings.vue'),
      beforeEnter: (to, from, next) => {
        if (!checkAuth()) {
          return next({ name: 'Login' })
        }

        return next()
      }
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
