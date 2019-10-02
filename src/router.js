import Vue from 'vue'
import VueRouter from 'vue-router'
import {routes} from './routes'
import store from './store/store'

Vue.use(VueRouter)

const router = new VueRouter({
  base: '/dt-trasferte/',
  //mode: 'history',
  routes
  })

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      if (store.getters.authStatus != 'success') {
        // after F5 refresh
        store.dispatch('showWaitDialog')
        store.dispatch('clearStoreData')
        store.dispatch('setUserInfo').then(() => {
          next('/movimenti')
          store.dispatch('hideWaitDialog')
        })
      } else {
        next()
      }
      return
    }
    // next('/login') 
  } else {
    next() 
  }
})

export default router