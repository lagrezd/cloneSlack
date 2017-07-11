import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Tchat from '@/pages/Tchat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/',
      component: Tchat,
      beforeEnter: (to, from, next) => {
        if (!firebase.auth().currentUser) {
          next('/login')
        } else {
          next()
        }
      }
    }
  ]
})
