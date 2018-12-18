/**
** @Description: Author Message
** @author Rick
** @date 2018/9/7
**/

const LoginPage = () => import('./Index.vue')

const routes = {
  path: '/login',
  name: 'LoginPage',
  component: LoginPage
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
