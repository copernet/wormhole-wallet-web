/**
** @Description: Author Message
** @author Rick
** @date 2018/9/7
**/

const SignPage = () => import('./Index.vue')

const routes = {
  path: '/signup',
  name: 'SignPage',
  component: SignPage
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
