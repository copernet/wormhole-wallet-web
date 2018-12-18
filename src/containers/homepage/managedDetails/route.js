/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/

const PropertyDetailsPage = () => import('./PropertyDetails')
const CrowdDetailsPage = () => import('./CrowdDetails')
const WhcDetailsPage = () => import('./WhcDetails')
const propertyRoute = {
  path: '/propertyDetails',
  name: 'propertyDetails',
  component: PropertyDetailsPage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'exAssets' || from.name === 'walletAssets' || from.name === 'walletHistory')) {
      next()
    } else {
      next('/home')
    }
  }
}

const crowdRoute = {
  path: '/crowdDetails',
  name: 'crowdDetails',
  component: CrowdDetailsPage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'exAssets' || from.name === 'walletAssets' || from.name === 'walletHistory')) {
      next()
    } else {
      next('/home')
    }
  }
}

const whcRoute = {
  path: '/whcDetails',
  name: 'whcDetails',
  component: WhcDetailsPage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'exAssets' || from.name === 'walletAssets' || from.name === 'walletHistory')) {
      next()
    } else {
      next('/home')
    }
  }
}

export { propertyRoute, crowdRoute, whcRoute }
