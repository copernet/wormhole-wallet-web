/**
** @Description: Author Message
** @author Rick
** @date 2018/9/25
**/

const PropertyHistoryPage = () => import('./Index.vue')

const propertyHistoryRoute = {
  path: '/propertyHistoryPage',
  name: 'propertyHistoryPage',
  component: PropertyHistoryPage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'tradingDetails' || from.name === 'participateCrowds' || from.name === 'whcDetails' || from.name === 'propertyDetails' || from.name === 'crowdDetails')) {
      next()
    } else {
      next('/home')
    }
  }
}

export default propertyHistoryRoute
