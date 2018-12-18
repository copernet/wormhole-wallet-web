<template lang="pug">
    div(class='container')
        q-tabs(color = 'white' text-color="blue")
            q-tab(
            default
            slot="title"
            name="assetDetails"
            ) {{$t('homePage.myWallet.crowdSale.name')}}

            q-tab(
            slot="title"
            name="history"
            ) History
            q-tab-pane(name="history")
                property-history(:propertyId="detailData.propertyid")
            q-tab-pane(name="assetDetails")
                div.row
                    div(class="col-4")
                            q-input(:float-label="$t('homePage.myWallet.crowdSale.readName')" v-model="detailData.propertyName" readonly disabled)
                    div(class="col-6 offset-1")
                            q-input(
                            :float-label="$t('homePage.myWallet.crowdSale.url')"
                            v-model="detailData.propertyUrl"
                            readonly disabled
                            )
                div.row
                    div(class="col-4")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.category')"
                        v-model="detailData.categoryAddress"
                        readonly disabled
                        )
                    div(class="col-6 offset-1")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.subCategory')"
                        v-model="detailData.subcategoryAddress"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        v-model="detailData.deadline"
                        :float-label="$t('homePage.myWallet.crowdSale.deadline')"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.bonus')"
                        v-model="detailData.bonus"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.precision')"
                        v-model="detailData.precision"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.tokens')"
                        v-model="detailData.numberProperties"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.total_number')"
                        v-model="detailData.totalNumber"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-field
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.balance')"
                            v-model="bchBalance"
                            readonly disabled
                            )
                div.row
                    div.col-11
                        q-field
                            q-input(
                            :float-label="$t('homePage.myWallet.crowdSale.address')"
                            v-model="cacheAddress"
                            readonly disabled
                            )
                div(style="margin-top: 15px")
                div.row
                    div.col-11
                        q-input(
                        type="textarea"
                        :float-label="$t('homePage.myWallet.crowdSale.smartDes')"
                        v-model="detailData.propertyData"
                        readonly disabled
                        )
                div(v-if="inputStatus && (!notChange)")
                    div.row
                        div.col-11
                            q-field
                                q-input(
                                :float-label="$t('homePage.myWallet.crowdSale.newAddress')"
                                v-model="detailData.selectedAddress"
                                :error="addressStatus"
                                )
                    div.row
                        div.col-11
                            q-field(error-label=">= 0.00000001 BCH")
                                q-input(
                                :float-label="$t('homePage.myWallet.crowdDetails.inputFees')"
                                v-model="inputFees"
                                :error="inputFeesStatus"
                                readonly disabled
                                )
                    div(style="height: 5px")
                    div.row
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
                div(v-if="inputStatus && notChange")
                    div.row
                        div.col-11
                            q-field(error-label=">= 0.00000001 BCH")
                                q-input(
                                :float-label="$t('homePage.myWallet.crowdDetails.inputFees')"
                                v-model="inputFees"
                                :error="inputFeesStatus"
                                readonly disabled
                                )
                    div.row
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
                div.row.bottom-button
                    div.col-3(v-if="notChange")
                        q-btn.full-width(
                        color="light-blue-5"
                        @click="changeAddress"
                        ) {{$t('homePage.myWallet.crowdDetails.changeAddress')}}
                    div.col-3(v-else)
                        q-btn.full-width(
                        color="primary"
                        @click="submitAddress"
                        :disabled="addressStatus || inputFeesStatus"
                        ) {{$t('homePage.myWallet.crowdDetails.submit')}}
                    div.col-3.offset-3(v-if="active && inputStatus && notChange")
                        q-btn.full-width(
                        :disabled=" inputFeesStatus "
                        color="negative"
                        @click="submitShuntDown") {{$t('homePage.myWallet.crowdDetails.submit')}}
                    div.col-3.offset-3(v-if="active && !(inputStatus && notChange)")
                        q-btn.full-width(
                        color="warning"
                        @click="shuntDown") {{$t('homePage.myWallet.crowdDetails.shutDown')}}
                div(style="height: 60px")
                div(v-if="showRecords")
                    div.row
                        div.col-11
                            q-table(
                            :columns="columns"
                            color="primary"
                            row-key="TxHash"
                            :data="tradeData"
                            :pagination.sync="pagination"
                            hide-bottom
                            title="Transaction Records"
                            )
                                q-tr(
                                slot="body"
                                slot-scope="props"
                                :props="props"
                                @click.native="jumpToDetails(props.row)"
                                style="cursor: pointer"
                                )
                                    q-td
                                        div.tx-hash {{props.row.txid}}
                                            q-tooltip(anchor="bottom middle" self="top left") {{props.row.txid}}
                                    q-td {{props.row.amount}}
                                    q-td {{props.row.purchasedtokens}}
                                    q-td
                                        div.tx-hash {{props.row.type_int}}
                                            q-tooltip(anchor="bottom middle" self="top left") {{props.row.type_int}}
                                    q-td {{props.row.blocktime}}
                                    q-td {{props.row.confirmations}}
                            div(style="height:5px")
                            q-pagination(
                            size="12px"
                            :max-pages="10"
                            v-model="page"
                            :max="maxPage"
                            direction-links
                            text-color="grey"
                            @input="getTransactions"
                            color="light"
                            )
                div(v-else).caption No Transaction Records ...
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance, transformType } from '../../../util/transform'
import { Big } from 'big.js'
import { date, QSpinnerFacebook } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import popup from '../../../util/notify'
import request from '../../../util/request'
import QField from 'quasar-framework/src/components/field/QField'
import PropertyHistory from '../propertyHistory/Index'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
const { mapState } = createNamespacedHelpers('accountModule')
export default {
  components: { QField, PropertyHistory },
  data () {
    return {
      detailData: {
        categoryAddress: '',
        subcategoryAddress: '',
        propertyName: '',
        propertyUrl: '',
        minerFees: '',
        selectedAddress: '',
        deadline: null,
        bonus: '',
        numberProperties: '',
        precision: '',
        totalNumber: '',
        propertyData: '',
        propertyid: ''
      },
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      notChange: true,
      inputStatus: false,
      cacheAddress: '',
      inputFees: '',
      active: false,
      tradeData: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      oldParams: {
        id: '',
        page: ''
      },
      page: 1,
      maxPage: 0,
      pageSize: 5,
      columns: [
        { name: 'txid', label: 'Tx Hash', align: 'left' },
        { name: 'amount', label: 'Spent WHC', align: 'left' },
        { name: 'purchasedtokens', label: 'Purchased Tokens', align: 'left' },
        { name: 'type_int', label: 'Type', align: 'left' },
        { name: 'blocktime', label: 'Block Time', align: 'left' },
        { name: 'confirmations', label: 'Confirmations', align: 'left' }
      ]
    }
  },
  validations: {
    detailData: {
      selectedAddress: {
        required
      }
    },
    inputFees: {
      required
    }
  },
  computed: {
    ...mapState(['account_wallet']),
    showRecords: vm => {
      if (vm.tradeData.length !== 0) {
        return true
      }
      return false
    },
    // get bch balance
    bchBalance: vm => {
      let balance = ''
      let addresses = vm.account_wallet.addresses || ''
      let selectedAddress = vm.cacheAddress || ''
      if (addresses && selectedAddress) {
        let selectedItem
        addresses.forEach((item) => {
          if (item.address === selectedAddress) {
            selectedItem = item
          }
        })
        if (selectedItem) {
          balance = getBalance(selectedItem, vm.$store.state.walletModule.bch)
        }
      }
      return balance
    },
    addressStatus: vm => {
      if (vm.$v.detailData.selectedAddress.required) {
        return false
      }
      return true
    },
    inputFeesStatus: vm => {
      return !(isNum(vm.inputFees) && vm.$v.inputFees.required && (vm.inputFees >= 0.00000001))
    }
  },
  methods: {
    getTransactions () {
      let id = this.$route.params.propertyid
      let { page, pageSize } = this
      if (id === this.oldParams.id && page === this.oldParams.page) {
        return
      }
      request.getCsTransactions(id, page).then((data) => {
        if (data.code === 0) {
          let result = data.result
          if (!result.list) { return }
          this.maxPage = Math.ceil(result.total / pageSize)
          this.oldParams.id = id
          this.oldParams.page = page
          this.tradeData = result.list.map((item) => {
            if (item.blocktime) {
              item.blocktime = date.formatDate((parseFloat(item.blocktime) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            }
            if (item.type_int) {
              item.type_int = transformType(item.type_int)
            }
            return item
          })
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        popup.warning(error, this)
      })
    },
    // jump to read trade detail
    jumpToDetails (property) {
      let params = {}
      if (property.txid) {
        params = { txHash: property.txid }
        this.$router.push({ name: 'tradingDetails', params })
      }
    },
    // get fee status
    getFees () {
      this.$q.loading.show(loadingOptions)
      request.getTranscationFees().then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          this.feeData.fast = result.Fast + ''
          this.feeData.normal = result.Normal + ''
          this.feeData.slow = result.Slow + ''
          this.inputFees = result.Normal + ''
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    },
    // validate from address
    chooseAddress (add) {
      if (this.account_wallet.addresses) {
        let addObj
        this.account_wallet.addresses.forEach((item) => {
          if (item.address === add) {
            addObj = item
          }
        })
        return addObj
      }
    },
    shuntDown () {
      this.inputStatus = true
      this.notChange = true
      this.inputFees = this.feeData.normal
    },
    // assetCreation
    assetCreation () {
      let { selectedAddress } = this.detailData
      let fee = new Big(this.inputFees)
      let transactionData
      let tData = {
        transaction_version: 0,
        transaction_to: selectedAddress,
        currency_identifier: this.$route.params.propertyid
      }
      let fromAddress = this.chooseAddress(this.cacheAddress)
      if (!fromAddress) {
        return false
      }
      transactionData = transaction(70, fromAddress, fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    shutAssetCreation () {
      let fee = new Big(this.inputFees)
      let transactionData
      let tData = {
        transaction_version: 0,
        currency_identifier: this.$route.params.propertyid
      }
      let fromAddress = this.chooseAddress(this.cacheAddress)
      if (!fromAddress) {
        return false
      }
      transactionData = transaction(53, fromAddress, fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    changeAddress () {
      this.notChange = false
      this.inputStatus = true
      this.detailData.selectedAddress = ''
      this.inputFees = this.feeData.normal
    },
    addressValidate () {
      let { selectedAddress } = this.detailData
      try {
        isBCHCashAddress(selectedAddress)
        confirm(this, loadingOptions, this.assetCreation())
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    submitAddress () {
      let { inputFees, bchBalance, addressValidate } = this
      if (parseFloat(inputFees) > parseFloat(bchBalance)) {
        return popup.warning('not enough BCH', this)
      } else {
        addressValidate()
      }
    },
    submitShuntDown () {
      let { inputFees, bchBalance, shutAssetCreation } = this
      if (parseFloat(inputFees) > parseFloat(bchBalance)) {
        return popup.warning('not enough BCH', this)
      }
      confirm(this, loadingOptions, shutAssetCreation())
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  activated () {
    let routeParams = this.$route.params
    let property
    property = routeParams
    this.active = property.active
    this.cacheAddress = property.issuer
    this.detailData.propertyName = property.name
    this.detailData.propertyUrl = property.url
    this.detailData.categoryAddress = property.category || '-'
    this.detailData.selectedAddress = property.issuer
    this.detailData.deadline = date.formatDate((parseFloat(property.deadline) * 1000), 'YYYY-MM-DDTHH:mm:ss')
    this.detailData.bonus = property.earlybonus + '%'
    this.detailData.totalNumber = property.totaltokens
    this.detailData.propertyData = property.data
    this.detailData.precision = property.precision
    this.detailData.numberProperties = property.tokensperunit + ''
    this.detailData.subcategoryAddress = property.subcategory || '-'
    this.detailData.propertyid = property.propertyid
    this.getFees()
    this.getTransactions()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .crowd-title {
       margin: 0px 0 10px;
    }
    .bottom-button {
        padding-top: 50px;
    }
    .tx-hash {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
