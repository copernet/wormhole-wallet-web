/**
 ** @Description: Author Message
 ** @author Rick
 ** @date 2018/9/7
 **/

import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// import subRoutes
import homeRoutes from '../containers/homepage/route'
import loginRoutes from '../containers/loginpage/route'
import signRoutes from '../containers/signpage/route'
import indexRoutes from '../containers/indexPage/route'
import legalRoutes from '../containers/legalPage/route'

Vue.use(Router)

const router = new Router({
  model: 'history',
  routes: [
    { path: '/home', redirect: '/walletOverview' }
  ]
})

router.addRoutes([{ ...homeRoutes }, { ...loginRoutes }, { ...signRoutes }, { ...indexRoutes }, { ...legalRoutes }])
let noAuthPaths = ['/', '/signup', '/login', '/legal', '/disclaimer', '/termofservice', '/faq']
router.beforeEach((to, from, next) => {
  let path = to.path
  if (noAuthPaths.includes(path)) {
    next()
  } else {
    if (store.state.accountModule.account_loggedin) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

export default router
