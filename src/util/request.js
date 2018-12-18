/**
 * http request collection
 */
import Vue from 'vue'
import qs from 'qs'
export default {
  /**
     * request challenge api and get the the crypto base data for the account api
     * @param {*} uuid
     */
  wallet_challenge (uuid) {
    return Vue.axios.get('/user/wallet/challenge', {
      params: {
        uuid: uuid
      }
    })
  },
  /**
     * for creating wallet
     * @param {*} params
     */
  wallet_create (params) {
    return Vue.axios.post('/user/wallet/create', qs.stringify(params))
  },
  /**
     * for updating wallet
     * @param {*} params
     */
  wallet_update (params) {
    return Vue.axios.post('/user/wallet/update', qs.stringify(params))
  },
  /**
     * for login
     * @param {} params
     */
  wallet_login (params) {
    return Vue.axios.post('/user/wallet/login', qs.stringify(params))
  },
  /**
   * for geting unsigin transaction_unsigin
   * @param {} params
   */
  transaction_unsigin (url, params) {
    return Vue.axios.post(url, qs.stringify(params))
  },
  /**
   * for geting unsigin Bch transaction_unsigin
   * @param {} params
   */
  transaction_unsigin_bch (url, params) {
    return Vue.axios.post(url, params)
  },
  /**
   * for broadcasting transaction
   * @param {} params
   */
  transaction_pushtx (params, type) {
    if (type === 'assemble') {
      let bchTx = { tx: params.signedTx }
      return Vue.axios.post('/bch/broadcast', qs.stringify(bchTx))
    }
    return Vue.axios.post('/transaction/push', qs.stringify(params))
  },
  /**
   * for geting category data
   * @param {} params
   */
  get_categories () {
    return Vue.axios.get('/category/')
  },
  /**
   * for geting Asset data
   * @param {} params
   */
  getAssetList (params, pageNo = 1, pageSize = 15) {
    let url = `/property/listbyowner?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.post(url, params)
  },
  /**
   * for geting Property data
   * @param {} params
   */
  getPropertyList (pageNo = 1, pageSize = 15) {
    let url = `/property/list?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.get(url)
  },
  /**
   * get all the property of every address
   */
  balance_addresses_details (params) {
    return Vue.axios.post('/balance/addresses', params)
  },
  /**
   * get transcation history of crowd sales
   */
  getCsTransactions (id, pageNo = 1, pageSize = 5) {
    let url = `/crowdsale/purchase/record/id/${id}?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.get(url)
  },
  /**
   * get history of addresses
   */
  getAddressHistories (params, pageNo = 1, pageSize = 15) {
    let url = `/history/list?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.post(url, params)
  },
  /**
   * get hash details
   */
  getHashDetails (hash) {
    let url
    if (hash.isBch) {
      url = `/history/detail?tx_hash=${hash.txHash}&type=bch`
    } else {
      url = `/history/detail?tx_hash=${hash.txHash}`
    }
    return Vue.axios.get(url)
  },
  /**
   * get history of Property
   */
  getPropertyHistory (urlParams, params) {
    let url = `/history/id/${urlParams}`
    return Vue.axios.post(url, qs.stringify(params))
  },
  get_env () {
    return Vue.axios.get('/env')
  },

  /**
   * get history of addresses
   */
  getActiveCrowds (pageNo = 1, pageSize = 15) {
    let url = `/crowdsale/list/active?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.get(url)
  },
  /**
   * create new mfa
   */
  new_mfa (params) {
    return Vue.axios.post('/user/wallet/newMfa', qs.stringify(params))
  },
  /**
   * bch get balance
   */
  getBchBalance (params) {
    return Vue.axios.post('/balance/bch/addresses', params)
  },
  /**
   * get bch trading history
   */
  getBchHistory (params) {
    return Vue.axios.get('/bch/hists', { params })
  },
  /**
   * get bch trading history
   */
  getTranscationFees () {
    return Vue.axios.post('/transaction/fee')
  },
  /**
   * bch get balance
   */
  getOwnersList (propertyId, params) {
    const { pageSize, pageNo } = params
    const url = `/property/listowners/${propertyId}?pageSize=${pageSize}&pageNo=${pageNo}`
    return Vue.axios.post(url, qs.stringify(params))
  }
}
