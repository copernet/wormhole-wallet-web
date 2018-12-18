/**
 * store all status about global config
 */
export const configModule = {
  namespaced: true,
  state: {
    nethasfetched: false
  },
  mutations: {
    set_nethasfetched (state, fetched) {
      state.nethasfetched = fetched
    }
  },
  actions: {
    /**
       *
       * @param {} context
       * @param {*} params
       */
    config_nethasfetched_action: {
      root: true,
      handler (context, fetched) {
        context.commit('set_nethasfetched', fetched)
      }
    }
  }
}
