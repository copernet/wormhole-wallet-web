<template lang="pug">
    div
        q-tabs(color = 'white' text-color="blue")
            q-tab(default slot="title" name="assets" ) {{$t('homePage.tradingHistory.assets')}}
            q-tab(slot="title" name="bch" @select="changeHistory") {{$t('homePage.tradingHistory.bch')}}
            q-tab-pane(name="assets")
                q-table(
                :columns="columns"
                color="primary"
                row-key="tx_hash"
                :data="historyData"
                :pagination.sync="pagination"
                hide-bottom
                )
                    q-tr(
                    slot="body"
                    slot-scope="props"
                    :props="props"
                    @click.native="jumpToDetails(props.row)"
                    style="cursor: pointer"
                    )
                        q-td
                            div.tx-hash {{ props.row.property_name }}
                                q-tooltip(anchor="bottom middle" self="top left") {{ props.row.property_name }}
                        q-td
                            div.tx-hash {{ props.row.tx_type }}
                                q-tooltip(anchor="bottom middle" self="top left") {{ props.row.tx_type }}
                        q-td {{ props.row.address_role }}
                        q-td {{ props.row.balance_available_credit_debit }}
                        q-td(:class="props.row.tx_state =='invalid' ? 'invalid-color' :''") {{ props.row.tx_state }}
                        q-td
                            div {{ props.row.created }}
                        q-td
                            div.tx-hash {{ props.row.tx_hash }}
                                q-tooltip(anchor="center left" self="center right") {{ props.row.tx_hash }}
                    div(slot="top" slot-scope="props" class="row justify-end fit")
                        q-select(
                        v-model="selectHistory"
                        :float-label="$t('homePage.history.chooseAddress')"
                        :options="addressData"
                        @input="inputToken"
                        )
                div(style="height: 10px")
                q-pagination(:max-pages="10" v-model="tokenPPage"  :max="tokenPMaxPage" direction-links @input="goTokenPage")
            q-tab-pane(name="bch")
                q-table(
                :columns="bchColumns"
                color="primary"
                row-key="TxHash"
                :data="bchHistoryData"
                :pagination.sync="bchPagination"
                hide-bottom
                )
                    q-tr(
                    slot="body"
                    slot-scope="props"
                    :props="props"
                    @click.native="jumpToDetails(props.row)"
                    style="cursor: pointer"
                    )
                        q-td {{props.row.balanceDiff}}
                        q-td {{props.row.confirmations}}
                        q-td {{props.row.isReceive}}
                        q-td {{props.row.blockUTCTimestamp}}
                        q-td
                            div.tx-hash {{props.row.TxHash}}
                                q-tooltip(anchor="center left" self="center right") {{props.row.TxHash}}
                    div(slot="top" slot-scope="props" class="row justify-end fit")
                        q-select(
                        v-model="selectBchHistory"
                        :float-label="$t('homePage.history.chooseAddress')"
                        :options="bchAddressData"
                        @input="inputBch"
                        )
                div(style="height: 10px")
                q-pagination(:max-pages="10" v-model="bchPPage"  :max="bchPMaxPage" direction-links @input="goBchPage")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import commonUtil from '../../../util/common'
import request from '../../../util/request'
import popup from '../../../util/notify'
import { transformType } from '../../../util/transform'
import { QSpinnerFacebook, date } from 'quasar'

const { mapState } = createNamespacedHelpers('accountModule')
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      columns: [
        { name: 'property_name', label: 'Property Name', align: 'left' },
        { name: 'tx_type', label: 'Type', align: 'left' },
        { name: 'address_role', label: 'Address Role', align: 'left' },
        { name: 'balance_available_credit_debit', label: 'Amount', align: 'left' },
        { name: 'tx_state', label: 'State', align: 'left' },
        { name: 'created', label: 'Block Time', align: 'left' },
        { name: 'tx_hash', required: true, label: 'Tx Hash', align: 'left' }
      ],
      bchColumns: [
        { name: 'balanceDiff', label: 'Transaction Amount', align: 'left' },
        { name: 'confirmations', label: 'Confirmations', align: 'left' },
        { name: 'isReceive', label: 'Status', align: 'left' },
        { name: 'blockUTCTimestamp', label: 'Block Time', align: 'left' },
        { name: 'TxHash', label: 'Tx Hash', align: 'left' }
      ],
      historyData: [],
      bchHistoryData: [],
      addressData: [],
      bchAddressData: [],
      selectHistory: 0,
      selectBchHistory: 0,
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      bchPagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      oldParams: {
        addressStr: '',
        page: ''
      },
      oldBchParams: {
        addressStr: '',
        page: ''
      },
      bchPPage: 1,
      bchPMaxPage: 0,
      bchPPageSize: 15,
      tokenPPage: 1,
      tokenPMaxPage: 0,
      tokenPPageSize: 15
    }
  },
  computed: {
    ...mapState(['account_wallet'])
  },
  methods: {
    goBchPage (val) {
      this.getBchHistory(this.selectBchHistory)
    },
    goTokenPage (val) {
      this.getHistory(this.selectHistory)
    },
    changeHistory () {
      if (this.bchHistoryData.length === 0 && this.selectBchHistory === 0) {
        this.getBchHistory(0)
      }
    },
    inputToken (val) {
      this.tokenPPage = 1
      this.getHistory(val)
    },
    inputBch (val) {
      this.bchPPage = 1
      this.getBchHistory(val)
    },
    // get bch history data
    getBchHistory (val) {
      let addr = this.addressData[val].label
      let page = this.bchPPage
      let pageSize = this.bchPPageSize
      if (this.oldBchParams.addressStr === addr && this.oldBchParams.page === page) {
        return
      }
      this.$q.loading.show(loadingOptions)
      request.getBchHistory({ addr, page, pageSize }).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result.list
          this.oldBchParams.addressStr = addr
          this.oldBchParams.page = page
          this.bchHistoryData.splice(0)
          if (result && result.length !== 0) {
            result.forEach((item) => {
              if (item.blockUTCTimestamp) {
                item.blockUTCTimestamp = date.formatDate((parseFloat(item.blockUTCTimestamp) * 1000), 'YYYY-MM-DDTHH:mm:ss')
              } else if (parseInt(item.blockUTCTimestamp) === 0) {
                item.blockUTCTimestamp = 'not confirmed'
              } else {
                item.blockUTCTimestamp = ''
              }
              if (item.txid) {
                item.TxHash = item.txid
              }
              if (item.isReceive) {
                item.isReceive = 'receive'
              } else {
                item.isReceive = 'send'
              }
              // item.balanceDiff = Math.abs(parseFloat(item.balanceDiff))
            })
            this.bchPMaxPage = Math.ceil(data.result.total / pageSize)
            this.bchHistoryData = [...result]
          } else if (result.length === 0) {
            this.bchPMaxPage = 0
          }
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        popup.warning(error, this)
      })
    },
    // get token history data
    getHistory (val) {
      let addresses = []
      let addressStr
      let page = this.tokenPPage
      let pageSize = this.tokenPPageSize
      if (this.addressData[val].label === 'ALL') {
        this.addressData.forEach((item) => {
          if (item.label !== 'ALL') {
            addresses.push(item.label)
          }
        })
      } else {
        addresses.push(this.addressData[val].label)
      }
      addressStr = commonUtil.generateQsArrayString('address', addresses)
      if (this.oldParams.addressStr === addressStr && this.oldParams.page === page) {
        return
      }
      this.$q.loading.show(loadingOptions)
      request.getAddressHistories(addressStr, page).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          let resultArr
          if (Array.isArray(result)) {
            resultArr = []
            this.tokenPMaxPage = 0
          } else {
            resultArr = result.list
            this.tokenPMaxPage = (Math.ceil(result.total / pageSize))
          }
          this.oldParams.addressStr = addressStr
          this.oldParams.page = page
          this.historyData.splice(0)
          resultArr.forEach((item) => {
            item.tx_type = transformType(item.tx_type)
            if (item.created) {
              item.created = date.formatDate((parseFloat(item.created) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            } else if (parseInt(item.created) === 0) {
              item.created = 'not confirmed'
            } else {
              item.created = ''
            }
          })
          this.historyData = [...resultArr]
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    },
    // jump to read trade detail
    jumpToDetails (property) {
      let params = {}
      if (property.tx_hash) {
        params = { txHash: property.tx_hash }
      } else if (property.TxHash) {
        params = { txHash: property.TxHash, isBch: true }
      }
      this.$router.push({ name: 'tradingDetails', params })
    }
  },
  activated () {
    if (this.account_wallet.addresses) {
      this.addressData = this.account_wallet.addresses.map((item, index) => {
        return { label: item.address, value: index }
      })
      this.bchAddressData = [...this.addressData]
      if (this.addressData.length !== 0) {
        let last = { label: 'ALL', value: this.addressData.length }
        this.addressData.push(last)
        this.getHistory(0)
      }
    }
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .invalid-color {
        color: red;
    }
    .tx-hash {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
