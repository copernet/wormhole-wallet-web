/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/
const OverviewPage = () => import('./Index.vue')

const routes = {
  path: '/walletOverview',
  name: 'walletOverview',
  component: OverviewPage
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
