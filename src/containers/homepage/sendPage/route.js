/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/
const SendPage = () => import('./Index.vue')

const routes = {
  path: '/walletSend',
  name: 'walletSend',
  component: SendPage
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
