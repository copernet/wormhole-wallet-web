/**
** @Description: Author Message
** @author Rick
** @date 2018/9/19
**/

const ExCrowdSalesPage = () => import('./Index.vue')
const EXPartCrowdDetails = () => import('./PartCrowdDetails')
const exCrowdSalesroutes = {
  path: '/exCrowdSales',
  name: 'exCrowdSales',
  component: ExCrowdSalesPage,
  children: []
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

const participateCrowdsRoutes = {
  path: '/participateCrowds',
  name: 'participateCrowds',
  component: EXPartCrowdDetails,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'exAssets' || from.name === 'exCrowdSales')) {
      next()
    } else {
      next('/home')
    }
  }
}
export { exCrowdSalesroutes, participateCrowdsRoutes }
