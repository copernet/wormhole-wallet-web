/**
 * Created by Rick on 2018/4/18.
 */
import * as actions from './action'
import * as getters from './getter'
import * as mutations from './mutation'
export const authModule = {
  namespaced: true,
  state: {},
  mutations,
  getters,
  actions
}
