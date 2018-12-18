/**
** @Description: Author Message
** @author Rick
** @date 2018/10/11
**/

const tradePage = () => import('./Index.vue')

const routes = {
  path: '/tradingDetails',
  name: 'tradingDetails',
  component: tradePage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}')) {
      next()
    } else {
      next('/home')
    }
  }
}

export default routes
