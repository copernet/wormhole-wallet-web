/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/

const AssetsPage = () => import('./Index.vue')
const CreateWhc = () => import('./WhcPage.vue')
const CreateAirDrop = () => import('./AirDrop.vue')
const CreateCrowdPage = () => import('./CrowdPage.vue')
const CreatePropertyPage = () => import('./PropertyPage.vue')
const CreateSendAllPage = () => import('./SendAllPage.vue')
const assetRoute = {
  path: '/walletAssets',
  name: 'walletAssets',
  component: AssetsPage,
  children: []
}
const createAirDropRoute = {
  path: '/createAirDrop',
  name: 'createAirDrop',
  component: CreateAirDrop
}

const createCrowdPageRoute = {
  path: '/createCrowdPage',
  name: 'createCrowdPage',
  component: CreateCrowdPage
}

const createPropertyPageRoute = {
  path: '/createPropertyPage',
  name: 'createPropertyPage',
  component: CreatePropertyPage,
  beforeEnter (to, from, next) {
    if (to.params && (JSON.stringify(to.params) !== '{}') && from.name && (from.name === 'walletAssets')) {
      next()
    } else {
      next('/home')
    }
  }
}

const createSendAllPageRoute = {
  path: '/createSendAllPage',
  name: 'createSendAllPage',
  component: CreateSendAllPage
}

const createWhcRoute = {
  path: '/createWhcPage',
  name: 'createWhcPage',
  component: CreateWhc
}

export { assetRoute, createWhcRoute, createSendAllPageRoute, createPropertyPageRoute, createCrowdPageRoute, createAirDropRoute }
