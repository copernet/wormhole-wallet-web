/**
** @Description: Author Message
** @author Rick
** @date 2018/9/19
**/

const ExAssetsPage = () => import('./Index.vue')
const routes = {
  path: '/exAssets',
  name: 'exAssets',
  component: ExAssetsPage,
  children: []
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
