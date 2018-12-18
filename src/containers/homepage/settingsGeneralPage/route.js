/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/
const SettingGeneralPage = () => import('./Index.vue')

const routes = {
  path: '/settingGeneral',
  name: 'settingGeneral',
  component: SettingGeneralPage,
  children: []
  // beforeEnter (to, from, next) {
  //   next('modules')
  // }
}

export default routes
