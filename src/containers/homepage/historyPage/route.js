/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/
const historyPage = () => import('./Index.vue')

const routes = {
  path: '/walletHistory',
  name: 'walletHistory',
  component: historyPage
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
