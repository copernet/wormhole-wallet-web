/**
** @Description: Author Message
** @author Rick
** @date 2018/9/7
**/

import addressRoute from './addressPage/route'
import { assetRoute, createWhcRoute, createSendAllPageRoute, createPropertyPageRoute, createCrowdPageRoute, createAirDropRoute } from './assetsPage/route'
import historyRoute from './historyPage/route'
import overviewRoute from './overview/route'
import sendRoute from './sendPage/route'
import exAssetsRoute from './exAssets/route'
import { exCrowdSalesroutes, participateCrowdsRoutes } from './exCrowdsales/route'
import settingGeneralRoute from './settingsGeneralPage/route'
import propertyHistoryRoute from './propertyHistory/route'
import tradingDetails from './tradingDetails/route'
import { propertyRoute, crowdRoute, whcRoute } from './managedDetails/route'

const HomePage = () => import('./Index.vue')

const routes = {
  path: '/home',
  name: 'HomePage',
  component: HomePage,
  children: []
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

// add  children routes

routes.children = [
  { ...addressRoute },
  { ...assetRoute },
  { ...createWhcRoute },
  { ...historyRoute },
  { ...overviewRoute },
  { ...sendRoute },
  { ...settingGeneralRoute },
  { ...createSendAllPageRoute },
  { ...createPropertyPageRoute },
  { ...createCrowdPageRoute },
  { ...createAirDropRoute },
  // { ...exTransactionsRoute },
  { ...exAssetsRoute },
  { ...exCrowdSalesroutes },
  { ...participateCrowdsRoutes },
  { ...propertyRoute },
  { ...crowdRoute },
  { ...whcRoute },
  { ...propertyHistoryRoute },
  { ...tradingDetails }
]
export default routes
