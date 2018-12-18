<template lang="pug">
    div(class='container')
        q-tabs(color = 'white' text-color="blue")
            q-tab(
                default
                slot="title"
                name="assetDetails"
                ) {{isSmart ? $t('homePage.myWallet.propertyDetails.smartName') : $t('homePage.myWallet.propertyDetails.manageName')}}

            q-tab(
                slot="title"
                name="Owners"
                v-if="!isSmart"
                ) Owners
            q-tab(
                slot="title"
                name="history"
            ) History
            q-tab-pane(name="history")
                property-history(:propertyId="detailData.propertyid")
            q-tab-pane(
                name="Owners"
                v-if="!isSmart"
                )
                owners-page(:detailData="detailData" :isReadOnly="isReadOnly")
            q-tab-pane(name="assetDetails")
                div.row
                    div.col-4
                        q-input(:float-label="$t('common.propertyName')" v-model="detailData.propertyName" readonly disabled)
                    div.col-6.offset-1
                        q-input(:float-label="$t('homePage.myWallet.smartP.url')" v-model="detailData.propertyUrl" readonly disabled)
                div.row
                    div.col-4
                        q-input(
                            :float-label="$t('homePage.myWallet.smartP.category')"
                            separator
                            v-model="detailData.categoryAddress"
                            readonly disabled
                            )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.smartP.subCategory')"
                        v-model="detailData.subcategoryAddress"
                        readonly disabled
                        )
                div(v-if="isReadOnly")
                    div(class='row')
                        div.col-4
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.tokenNum')"
                            v-model="detailData.numberProperties"
                            readonly disabled
                            )
                        div.col-6.offset-1
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.precision')"
                            v-model="detailData.precision"
                            readonly disabled
                            )
                    div.row
                        div.col-11
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.address')"
                            v-model="detailData.selectedAddress"
                            readonly disabled
                            )
                div(v-else)
                    div(class='row')
                        div.col-4
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.precision')"
                            v-model="detailData.precision"
                            readonly disabled
                            )
                        div.col-6.offset-1
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.address')"
                            v-model="detailData.selectedAddress"
                            readonly disabled
                            )
                    div.row
                        div.col-4
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.tokenNum')"
                            v-model="detailData.numberProperties"
                            readonly disabled
                            )
                        div.col-6.offset-1
                            q-input(
                            :float-label="$t('homePage.myWallet.smartP.balance')"
                            v-model="bchBalance"
                            readonly disabled
                            )
                div.row
                    div.col-11
                        q-input(
                        type="textarea"
                        :float-label="$t('homePage.myWallet.smartP.smartDes')"
                        v-model="detailData.propertyData"
                        readonly disabled
                        )
                div(v-if="changeStatus")
                    div.row
                        div.col-11
                            q-input(
                            :float-label="$t('homePage.myWallet.propertyDetails.inputAddress')"
                            v-model="inputAddress"
                            :error="addressStatus"
                            )
                    div.row
                        div.col-11
                            q-field(error-label=">= 0.00000001 BCH")
                                q-input(
                                :float-label="$t('homePage.myWallet.propertyDetails.inputFees')"
                                v-model="inputFees"
                                :error="inputFeesStatus"
                                reasonly disabled
                                )
                    div(style="height: 5px")
                    div.row
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                        div.col-2
                            q-radio(v-model="inputFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
                div(v-if="addStatus || isShutStatus")
                    div.row
                        div.col-4
                            q-field(:error-label="amountRange")
                                q-input(
                                    :float-label="$t('homePage.myWallet.propertyDetails.amount')"
                                    v-model="amount"
                                    :error="amountStatus"
                                    )
                        div.col-6.offset-1
                            q-field(:count="30")
                                q-input(
                                :float-label="$t('homePage.myWallet.propertyDetails.note')"
                                v-model="note"
                                :error="noteStatus"
                                )
                    div.row
                        div.col-11
                            q-field(error-label=">= 0.00000001 BCH")
                                q-input(
                                :float-label="$t('homePage.myWallet.propertyDetails.inputFees')"
                                v-model="additionalFees"
                                :error="additionalFeesStatus"
                                readonly disabled
                                )
                    div(style="height: 5px")
                    div.row
                        div.col-2
                            q-radio(v-model="additionalFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                        div.col-2
                            q-radio(v-model="additionalFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                        div.col-2
                            q-radio(v-model="additionalFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
                div.row.bottom-button(v-if="isReadOnly")
                    div.col-1
                        q-btn.full-width(
                        color="blue"
                        @click="goBack"
                        ) {{$t('homePage.myWallet.whcDetails.back')}}
                div.row.bottom-button(v-else)
                    div.col-3(v-if="changeStatus")
                        q-btn.full-width(
                        color="primary"
                        @click="submitAddress"
                        :disabled="addressStatus || inputFeesStatus"
                        ) {{$t('homePage.myWallet.crowdDetails.submit')}}
                    div.col-3(v-else)
                        q-btn.full-width(
                        color="light-blue-5"
                        @click="changeAddress"
                        ) {{$t('homePage.myWallet.crowdDetails.changeAddress')}}
                    div.col-3.offset-1(v-if="!isSmart && !addStatus")
                        q-btn.full-width(
                        color="info"
                        @click="add(false)") {{$t('homePage.myWallet.propertyDetails.addProperty')}}
                    div.col-3.offset-1(v-if="!isSmart && addStatus")
                        q-btn.full-width(
                        color="positive"
                        :disabled="amountStatus || noteStatus || additionalFeesStatus"
                        @click="submitAdditional"
                        ) {{$t('homePage.myWallet.crowdDetails.submit')}}
                    div.col-3.offset-1(v-if="!isSmart && !isShutStatus")
                        q-btn.full-width(
                        color="warning"
                        @click="add(true)") {{$t('homePage.myWallet.propertyDetails.shut')}}
                    div.col-3.offset-1(v-if="!isSmart && isShutStatus")
                        q-btn.full-width(
                        color="negative"
                        :disabled="amountStatus || noteStatus || additionalFeesStatus"
                        @click="submitAdditional"
                        ) {{$t('homePage.myWallet.crowdDetails.submit')}}
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import request from '../../../util/request'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance } from '../../../util/transform'
import { Big } from 'big.js'
import { QSpinnerFacebook } from 'quasar'
import { required } from 'vuelidate/lib/validators'
import popup from '../../../util/notify'
import PropertyHistory from '../propertyHistory/Index'
import OwnersPage from '../partials/OwnersPage'

const { mapState } = createNamespacedHelpers('accountModule')
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      detailData: {
        precision: '',
        categoryAddress: '',
        subcategoryAddress: '',
        propertyName: '',
        propertyUrl: '',
        propertyData: '',
        numberProperties: '',
        selectedAddress: '',
        propertyid: '',
        freezingenabled: false
      },
      isSmart: false,
      isReadOnly: false,
      changeStatus: false,
      addStatus: false,
      isShutStatus: false,
      amount: '',
      note: '',
      inputFees: '',
      inputAddress: '',
      additionalFees: '',
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      }
    }
  },
  validations: {
    inputFees: {
      required
    },
    inputAddress: {
      required
    },
    amount: {
      required
    },
    note: {
      required
    },
    additionalFees: {
      required
    }
  },
  computed: {
    ...mapState(['account_wallet']),
    // get bch balance
    bchBalance: vm => {
      let balance = ''
      let addresses = vm.account_wallet.addresses || ''
      let selectedAddress = vm.detailData.selectedAddress || ''
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
      if (vm.$v.inputAddress.required) {
        return false
      }
      return true
    },
    inputFeesStatus: vm => {
      return !(isNum(vm.inputFees) && vm.$v.inputFees.required && (vm.inputFees >= 0.00000001))
    },
    additionalFeesStatus: vm => {
      return !(isNum(vm.additionalFees) && vm.$v.additionalFees.required && (vm.additionalFees >= 0.00000001))
    },
    noteStatus: vm => {
      return !(vm.$v.note.required && (vm.note.length <= 30))
    },
    amountRange: vm => {
      let Range = vm.detailData.precision || 8
      let str = ''
      let begin
      let cacheRange
      let endNum
      let numberProperties = vm.detailData.numberProperties || '0'
      if (parseInt(vm.detailData.precision) === 0) {
        Range = 0
      }
      cacheRange = Range
      Range = -parseInt(Range)
      begin = Math.pow(10, Range)
      if (!vm.isShutStatus) {
        let factor = Math.pow(10, Range)
        endNum = new Big('9223372036854775807').times(factor).minus(numberProperties)
        if (endNum.lt(begin)) {
          str = `Already Reach Upper Limit`
        } else {
          str = `${begin} ~ ${endNum} (precision = ${cacheRange})`
        }
        return str
      }
      if (numberProperties && numberProperties !== '0') {
        endNum = numberProperties
        str = `${begin} ~ ${endNum} (precision = ${cacheRange})`
      } else if (numberProperties === '0') {
        str = `No More Token To Revoke`
      }
      return str
    },
    amountStatus: vm => {
      let { precision, numberProperties } = vm.detailData
      let amount = vm.amount
      precision = parseInt(precision)
      if (numberProperties && numberProperties && isNum(amount) && vm.$v.amount.required) {
        let amountBig = new Big(amount)
        let maxBig = new Big('9223372036854775807')
        if ((amountBig.gte(0.00000001)) && (amountBig.lte(maxBig))) {
          let endNumBig
          let index = amount.indexOf('.')
          let length
          if (vm.isShutStatus) {
            endNumBig = new Big(numberProperties)
          } else {
            let factor = Math.pow(10, precision)
            endNumBig = (new Big('9223372036854775807')).div(factor).minus(numberProperties)
          }
          if (amountBig.lte(endNumBig)) {
            if (index === -1) { return false }
            length = amount.split('.')[1].length
            if (length <= precision) { return false }
          }
        }
      }
      return true
    }
  },
  methods: {
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
    // assetCreation
    assetCreation () {
      let { selectedAddress } = this.detailData
      let fee = new Big(this.inputFees)
      let transactionData
      let tData = {
        transaction_version: 0,
        transaction_to: this.inputAddress,
        currency_identifier: this.$route.params.propertyid
      }
      let fromAddress = this.chooseAddress(selectedAddress)
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
    manageCreation () {
      let { selectedAddress } = this.detailData
      let fee = new Big(this.additionalFees)
      let transactionData
      let tData = {
        transaction_version: 0,
        currency_identifier: this.$route.params.propertyid,
        amount: this.amount + '',
        note: this.note
      }
      let fromAddress = this.chooseAddress(selectedAddress)
      if (!fromAddress) {
        return false
      }
      if (this.isShutStatus) {
        transactionData = transaction(56, fromAddress, fee, tData)
      } else {
        transactionData = transaction(55, fromAddress, fee, tData)
      }
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    add (isShut) {
      this.inputAddress = ''
      this.inputFees = this.feeData.normal
      this.amount = ''
      this.note = ''
      this.additionalFees = this.feeData.normal
      this.changeStatus = false
      if (isShut) {
        this.isShutStatus = true
        this.addStatus = false
      } else {
        this.isShutStatus = false
        this.addStatus = true
      }
    },
    addressValidate () {
      try {
        isBCHCashAddress(this.inputAddress)
        confirm(this, loadingOptions, this.assetCreation())
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    changeAddress () {
      this.changeStatus = true
      this.addStatus = false
      this.isShutStatus = false
      this.amount = ''
      this.note = ''
      this.additionalFees = this.feeData.normal
    },
    submitAddress () {
      let { inputFees, bchBalance } = this
      if (parseFloat(inputFees) > bchBalance) {
        return popup.warning('not enough BCH', this)
      }
      this.addressValidate()
    },
    submitAdditional () {
      let { additionalFees, bchBalance } = this
      if (parseFloat(additionalFees) > parseFloat(bchBalance)) {
        return popup.warning('not enough BCH', this)
      }
      confirm(this, loadingOptions, this.manageCreation())
    },
    goBack () {
      this.$router.go(-1)
    },
    goHistoryPage () {
      let routeParams = this.$route.params
      let params
      let propertyid
      if (routeParams.READ_ONLY_TYPE) {
        propertyid = routeParams.propertyReadOnly.propertyid
      } else {
        propertyid = routeParams.propertyid
      }
      params = { propertyid }
      this.$router.push({ name: 'propertyHistoryPage', params })
    }
  },
  components: { PropertyHistory, OwnersPage },
  activated () {
    let routeParams = this.$route.params
    let property
    if (routeParams.READ_ONLY_TYPE) {
      if (routeParams.READ_ONLY_TYPE === 'SMART_READ') {
        this.isSmart = true
      } else {
        this.isSmart = false
      }
      this.isReadOnly = true
      property = routeParams.propertyReadOnly
    } else {
      if (routeParams.type_int === 50) {
        this.isSmart = true
      } else {
        this.isSmart = false
      }
      this.isReadOnly = false
      property = routeParams
    }
    this.detailData.precision = property.precision
    this.detailData.categoryAddress = property.category || '-'
    this.detailData.subcategoryAddress = property.subcategory || '-'
    this.detailData.propertyName = property.name
    this.detailData.propertyUrl = property.url
    this.detailData.propertyData = property.data
    this.detailData.numberProperties = property.totaltokens + ''// total numbers
    this.detailData.selectedAddress = property.issuer
    this.detailData.propertyid = property.propertyid
    if (property.freezingenabled) {
      this.detailData.freezingenabled = property.freezingenabled
    }
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  }
}

</script>

<style lang="scss" scoped >
    .p-title {
        margin: 0px 0 10px;
    }
    .bottom-button {
        padding-top: 50px;
    }
</style>
