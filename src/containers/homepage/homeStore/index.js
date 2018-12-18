/**
** @Description: Author Message
** @author Rick
** @date 2018/9/11
**/

import * as actions from './action'
import * as getters from './getter'
import * as mutations from './mutation'
export const homeModule = {
  namespaced: true,
  state: {
    sideType: ''
  },
  mutations,
  getters,
  actions
}
