/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/
const AddressesPage = () => import('./Index.vue')

const routes = {
  path: '/walletAddresses',
  name: 'walletAddresses',
  component: AddressesPage,
  children: []
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
