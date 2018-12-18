/**
 * store all status about wallet
 */
// import commonUtil from '../util/common'
import request from '../util/request'
import commonUtil from '../util/common'
export const walletModule = {
  namespaced: true,
  state: {
    whc: {},
    bch: []
  },
  getters: {

  },
  mutations: {
    set_wallet_whc (state, whc) {
      state.whc = whc
    },
    set_wallet_bch (state, bch) {
      state.bch = bch
    }
  },
  actions: {
    /**
     * init the wallet
     * fetch the balance/address、balance/bch/address and
     * emit the event that add the address to socket server
     * @param {*} context
     * @param {*} wallet
     */
    wallet_init: {
      root: true,
      handler (context, wallet) {
        let addresses = wallet.addresses
        let addressArr = commonUtil.transferToAddressArr(addresses)
        let messageObj = {
          type: 'add',
          addresses: addressArr
        }
        context.dispatch('socket_emit', messageObj, { root: true })
        context.dispatch('socket_on', function (data) {
          data = JSON.parse(data)
          let type = data.symbol
          let bchObj = context.state.bch
          let wchObj = context.state.whc
          switch (type) {
            case 'BCH':
              let index = bchObj.findIndex(bchItem => {
                return bchItem.address === data.address
              })
              if (index > -1) {
                bchObj[index].confirmed = data.balance.confirmed
                bchObj[index].unconfirmed = data.balance.unconfirmed
              }
              context.commit('set_wallet_bch', bchObj)
              break
            case 'Wormhole':
              wchObj[data.address] = data.balance
              context.commit('set_wallet_whc', wchObj)
              break
          }
        }, { root: true })
        let addPostStr = commonUtil.generateQsArrayString('address', addressArr)
        let proArr = []
        proArr.push(request.balance_addresses_details(addPostStr))
        proArr.push(request.getBchBalance(addPostStr))
        Promise.all(proArr).then(resultArr => {
          let resultWhc = resultArr[0]
          let resultBch = resultArr[1]
          if (resultWhc.code === 0 && resultBch.code === 0) {
            context.commit('set_wallet_whc', resultWhc.result)
            context.commit('set_wallet_bch', resultBch.result)
          }
        })
      }
    },
    /**
     * fetch balance and save to vuex and
     * send message that add address to server by socket
     */
    wallet_addAddress: {
      root: true,
      handler (context, addresses) {
        let addPostStr = commonUtil.generateQsArrayString('address', addresses)
        let proArr = []
        proArr.push(request.balance_addresses_details(addPostStr))
        proArr.push(request.getBchBalance(addPostStr))
        Promise.all(proArr).then(resultArr => {
          let resultWhc = resultArr[0]
          let resultBch = resultArr[1]
          if (resultWhc.code === 0 && resultBch.code === 0) {
            let bchRes = resultBch.result
            let bchOri = context.state.bch
            bchOri.push(...bchRes)
            bchOri = commonUtil.removeDuplicates(bchOri, 'address')
            let whcRes = resultWhc.result
            let whcOri = context.state.whc
            for (var key in whcRes) {
              whcOri[key] = whcRes[key]
            }
            context.commit('set_wallet_whc', whcOri)
            context.commit('set_wallet_bch', bchOri)
          }
        })
        let messageObj = {
          type: 'add',
          addresses: addresses
        }
        context.dispatch('socket_emit', messageObj, { root: true })
      }
    },
    /**
     * remove address and send message to server by socket
     */
    wallet_removeAddress: {
      root: true,
      handler (context, address) {
        let bchOri = context.state.bch
        let whcOri = context.state.whc
        let index = bchOri.findIndex(bchItem => {
          return bchItem.address === address
        })
        if (index > -1) {
          bchOri.splice(index, 1)
        }
        delete whcOri[address]
        let messageObj = {
          type: 'remove',
          addresses: [address]
        }
        context.dispatch('socket_emit', messageObj, { root: true })
        context.commit('set_wallet_whc', whcOri)
        context.commit('set_wallet_bch', bchOri)
      }
    },
    wallet_destroy: {
      root: true,
      handler (context) {
        context.commit('set_wallet_whc', {})
        context.commit('set_wallet_bch', {})
        context.dispatch('socket_disconnect', null, { root: true })
      }
    },
    wallet_set_bch: {
      root: true,
      handler (context, params) {
        context.commit('set_wallet_bch', params)
      }
    },
    wallet_set_whc: {
      root: true,
      handler (context, params) {
        context.commit('set_wallet_whc', params)
      }
    }
  }
}
