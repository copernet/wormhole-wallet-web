/**
** @Description: Author Message
** @author Rick
** @date 2018/9/7
**/

// import sub_module
import { authModule } from '../containers/loginpage/loginStore/index'
import { accountModule } from '../store/acount'
import { homeModule } from '../containers/homepage/homeStore/index'
import { walletModule } from '../store/wallet'
import { configModule } from '../store/config'
import Vue from 'vue'
import Vuex from 'vuex'
import commonUtil from '../util/common'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message) {
      var self = this
      state.socket.message = message
      let data = message
      let type = data.symbol
      let bchObj = state.walletModule.bch || []
      let whcObj = state.walletModule.whc || {}
      switch (type) {
        case 'BCH':
          let index = bchObj.findIndex(bchItem => {
            return bchItem.address === data.address
          })
          if (index > -1) {
            bchObj[index].confirmed = data.balance.confirmed
            bchObj[index].unconfirmed = data.balance.unconfirmed
          }
          self.dispatch('wallet_set_bch', bchObj, { root: true })
          break
        case 'Wormhole':
          whcObj[data.address] = data.balance
          self.dispatch('set_wallet_whc', whcObj, { root: true })
          break
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT (state, count) {
      let addresses = state.accountModule.account_wallet.addresses || []
      if (addresses.length === 0) {
        return
      }
      let addressArr = commonUtil.transferToAddressArr(addresses)
      let messageObj = {
        type: 'add',
        addresses: addressArr
      }
      // Vue.prototype.$socket.send(JSON.stringify(messageObj))
      this.dispatch('socket_emit', messageObj, { root: true })
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    }
  },
  actions: {
    /**
       *
       * @param {} context
       * @param {*} params include: eventName,callback
       */
    socket_on: {
      root: true,
      handler (context, callback) {
        // context.state.socket.onmessage = function (event) {
        //   callback(event.data)
        // }
      }
    },
    /**
     *
     * @param {*} context
     * @param {*} params include:eventName,data
     */
    socket_emit: {
      root: true,
      handler (context, message) {
        waitForSocketConnection(Vue.prototype.$socket, function () {
          Vue.prototype.$socket.send(JSON.stringify(message))
        })
        var MAX_TIMES = 1000
        function waitForSocketConnection (socket, callback) {
          if (MAX_TIMES <= 0) {
            throw new Error('There is something wront with the Websocket server')
          }
          setTimeout(
            function () {
              --MAX_TIMES
              if (socket.readyState === 1) {
                if (callback != null) {
                  callback()
                }
              } else {
                waitForSocketConnection(Vue.prototype.$socket, callback)
              }
            }, 3) // wait 3 milisecond for the connection...
        }
      }
    },
    socket_connect: {
      root: true,
      handler (context, status) {

      }
    },
    socket_disconnect: {
      root: true,
      handler (context, status) {
        Vue.prototype.$socket.close()
      }
    }
  },
  modules: {
    authModule,
    accountModule,
    homeModule,
    walletModule,
    configModule
  }
})
