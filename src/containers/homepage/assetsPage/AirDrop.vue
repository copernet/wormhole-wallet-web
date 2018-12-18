<template lang="pug">
    div.container.smart-p-container.topic
        div.q-title {{$t('homePage.myWallet.airDrop.name')}}
            a(
                target="_blank"
                href="https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#token-airdrop-3"
                style="text-decoration: none;"
                )
                q-icon.whc-protocol(name="help_outline")
                    q-tooltip(anchor="bottom middle" self="top left") {{$t('homePage.myWallet.myAssets.protocol')}}
        div
            div.row
                div.col-5
                    q-select(
                        :stack-label="$t('homePage.myWallet.airDrop.propertyName')"
                        separator
                        v-model="formData.selectedProperty"
                        :options="propertyData"
                        )
                    balance(:balance="tokenBalance.currency" :currency="tokenBalance.name" description=" ")
            div.row
                div.col-5
                    q-field(:error-label="amountRange")
                        q-input(
                            :float-label="$t('homePage.myWallet.airDrop.amount')"
                            v-model="formData.amount"
                            :error="amountStatus"
                            )
            div.row
                div.col-5
                    q-input(
                    :float-label="$t('homePage.myWallet.myAssets.fees')"
                    v-model="formData.minerFees"
                    :error="minerFeesStatus || availableStatus",
                    placeholder="0.002"
                    readonly disabled
                    )
            div(style="height: 5px")
            div.row
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
            div(style="height: 5px")
            div.row
                div.col-10
                    q-select(
                    :stack-label="$t('homePage.myWallet.sendAll.fromAddress')"
                    separator
                    v-model="formData.selectedAddress"
                    :options="formData.issuerData"
                    @input="initSelectedProperty"
                    )
            div.blank
            div.row
                div.col-3
                    q-checkbox(v-model="showRedeem")  {{$t('homePage.myWallet.myAssets.redeem')}}
                div.col-7(v-if="showRedeem")
                    q-input(
                    v-model="formData.redeemAddress"
                    :error="redeemAddressStatus"
                    :placeholder="$t('homePage.myWallet.myAssets.redeemDes')"
                    )
            div.blank
            div.blank
            div.row
                div.col-3(style="position: relative")
                    q-field
                        q-checkbox(
                        v-model="showTarget"
                        ) {{$t('homePage.myWallet.airDrop.target')}}
                div.col-7(v-if="showTarget")
                    lenovo-search(@sendPropertyId="getPropertyId" @sendIdStatus="getIdStatus")
            div(style="height:30px")
            div.row
                div.col-2
                    q-btn(
                    color="light-blue-5"
                    size="md"
                    @click="submitTransaction"
                    class='full-width'
                    :disable="availableStatus || targetDataStatus || amountStatus || propertyDataStatus || minerFeesStatus || issuerDataStatus || redeemAddressStatus"
                    ) {{$t('homePage.myWallet.myAssets.next')}}
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import { Big } from 'big.js'
import Balance from '../partials/Balance'
import LenovoSearch from '../partials/LenovoSearch'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance, getWhcBalance, getTokenIds } from '../../../util/transform'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import { QSpinnerFacebook } from 'quasar'
import popup from '../../../util/notify'

import QField from 'quasar-framework/src/components/field/QField'
import request from '../../../util/request'
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  components: { QField, QIcon, Balance, LenovoSearch },
  data () {
    return {
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      formData: {
        selectedAddress: 0,
        minerFees: '',
        issuerData: [],
        redeemAddress: '',
        selectedProperty: 0,
        amount: '',
        targetId: ''
      },
      targetIdStatus: true,
      showRedeem: false,
      showTarget: false
    }
  },
  validations: {
    formData: {
      redeemAddress: {
        required
      },
      amount: {
        required
      },
      minerFees: {
        required
      }
    }
  },
  computed: {
    customerAddresses: vm => {
      return vm.$store.state.accountModule.account_wallet.addresses || ''
    },
    // get tokens
    propertyData: vm => {
      let data = []
      if (!vm.customerAddresses) {
        return data
      }
      data = getTokenIds(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc)
      return data
    },
    // get bch balance
    bchBalance: vm => {
      if (!vm.customerAddresses) {
        return ''
      }
      let balance = getBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.bch)
      return balance
    },
    availableStatus: vm => {
      let { minerFees } = vm.formData
      if (minerFees) {
        if (minerFees <= vm.bchBalance) {
          return false
        }
      }
      return true
    },
    // get token Balance
    tokenBalance: vm => {
      let balanceData = { name: '', currency: '' }
      if (!vm.propertyDataStatus) {
        let balance = getWhcBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc, vm.propertyData[vm.formData.selectedProperty].propertyid)
        balanceData.name = vm.propertyData[vm.formData.selectedProperty].label
        balanceData.currency = balance + ''
      }
      return balanceData
    },
    minerFeesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (vm.formData.minerFees >= 0.00000001))
    },
    amountRange: vm => {
      let str
      if (!vm.propertyDataStatus && vm.tokenBalance.currency > 0) {
        let precision = parseInt(vm.propertyData[vm.formData.selectedProperty].precision)
        let Range = -parseInt(precision)
        let begin
        let tokenBalanceBig = new Big(vm.tokenBalance.currency)
        begin = Math.pow(10, Range)
        if (tokenBalanceBig.gte(begin)) {
          let endNum = vm.tokenBalance.currency
          str = `${begin} ~ ${endNum} (precision = ${-Range})`
        }
      } else {
        str = ''
      }
      return str
    },
    amountStatus: vm => {
      let amount = vm.formData.amount
      if (isNum(amount) && vm.$v.formData.amount.required) {
        let amountBig = new Big(amount)
        if ((amountBig.gte(0.00000001))) {
          let maxBig = new Big(vm.tokenBalance.currency)
          if (amountBig.lte(maxBig)) {
            let index = amount.indexOf('.')
            let length
            if (index === -1) { return false }
            length = amount.split('.')[1].length
            if (!vm.propertyDataStatus) {
              let precision = vm.propertyData[vm.formData.selectedProperty].precision
              if (length <= precision) { return false }
            }
          }
        }
      }
      return true
    },
    issuerDataStatus: vm => {
      if (vm.formData.issuerData.length === 0) {
        return true
      }
      return false
    },
    targetDataStatus: vm => {
      if (vm.showTarget) {
        return vm.targetIdStatus
      }
      return false
    },
    propertyDataStatus: vm => {
      if (vm.propertyData.length === 0) {
        return true
      }
      return false
    },
    redeemAddressStatus: vm => {
      if (vm.showRedeem) {
        if (!vm.$v.formData.redeemAddress.required) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    getIdStatus (status) {
      this.targetIdStatus = status
    },
    // get propertyId
    getPropertyId (propertyId) {
      this.formData.targetId = propertyId
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
          this.formData.minerFees = result.Normal + ''
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    },
    initSelectedProperty () {
      this.formData.selectedProperty = 0
    },
    // assetCreation
    assetCreation () {
      let { minerFees, selectedProperty, selectedAddress, redeemAddress, targetId, amount } = this.formData
      let fee = new Big(minerFees)
      let transactionData
      let propertyData = this.propertyData
      let tData = {
        transaction_version: 0,
        propertyid: propertyData[selectedProperty].propertyid,
        amount: amount + ''
      }
      if (this.showRedeem) {
        tData.redeem_address = redeemAddress
      }
      if (this.showTarget && targetId !== '') {
        tData.distributionproperty = targetId
      }
      transactionData = transaction(3, this.customerAddresses[selectedAddress], fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    // validate redeem address
    addressValidate (veryRedeem = false) {
      let { redeemAddress } = this.formData
      try {
        if (veryRedeem) {
          isBCHCashAddress(redeemAddress)
        }
        confirm(this, loadingOptions, this.assetCreation(), false)
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    submitTransaction () {
      this.showRedeem ? this.addressValidate(true) : this.addressValidate()
    }
  },
  activated () {
    let bch = this.$store.state.walletModule.bch
    if (this.customerAddresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.customerAddresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
      this.getFees()
    }
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .tips{
        color: red;
        font-size: 16px;
        margin-top: 5px;
    }
    .topic {
        /*margin-top: 20px;*/
    }
    .blank {
        margin-top: 15px;
    }
    .largeBlank {
        margin-top: 40px;
    }
    .whc-protocol {
        color: #027be3;
        font-size: 18px;
        margin-left: 10px;
    }
</style>
