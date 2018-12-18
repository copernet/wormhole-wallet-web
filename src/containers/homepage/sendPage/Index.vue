<template lang="pug">
    div.container
        div.row
            div.q-title {{$t('homePage.myWallet.send.name')}}
        div(style="height: 18px")
        div.row
            div.col-10
                q-select(
                :stack-label="$t('homePage.myWallet.send.fromAddress')"
                eparator v-model="formData.selectedAddress"
                :options="formData.issuerData"
                @input="initSelectedProperty('address')"
                )
        div.row
            div.col-10
                q-select(
                :stack-label="$t('homePage.myWallet.send.choose')"
                separator
                v-model="formData.selectedProperty"
                :options="propertyData"
                @input="initSelectedProperty('property')"
                )
                balance(:balance="tokenBalance.currency" :currency="tokenBalance.name" description=" ")
        div.row
            div.col-10
                q-input(
                :float-label="$t('homePage.myWallet.myAssets.fees')"
                v-model="formData.minerFees"
                :error="minerFeesStatus || availableStatus"
                placeholder="0.002"
                readonly disabled
                )
        div(style="height: 7px")
        div.row
            div.col-2
                q-radio(v-model="formData.minerFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
            div.col-2
                q-radio(v-model="formData.minerFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
            div.col-2
                q-radio(v-model="formData.minerFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
        div(v-if="isBch")
            div
                div.row.add
                    q-icon.add-icon(name="add_circle" size="24px" color="primary" @click.native="addAddress")
                    div {{$t('homePage.myWallet.send.add')}}
                    div.validate-data(v-if="!toBchStatus") {{$t('homePage.myWallet.send.warning')}}
            div.row(v-for=" (item, index) in bchTransactionTo")
                div.col-3
                    q-field
                            q-input(
                            :float-label="$t('homePage.myWallet.send.sendBch')"
                            v-model="item.amount"
                            )
                div.col-6.offset-1
                    q-input(
                    :float-label="$t('homePage.myWallet.send.toAddress')"
                    v-model="item.address"
                    )
                div.col-1.remove(v-if="index !== 0" style="position: relative")
                    q-icon.absolute-bottom(
                    @click.native="removeAddress(index)"
                    name="remove_circle"
                    size="24px"
                    color="negative"
                    style="margin-left: 5px"
                    )
        div.row(v-else)
            div.col-3
                q-field(:error-label="amountRange")
                    q-input(
                    :float-label="$t('homePage.myWallet.send.amount')"
                    v-model="formData.amount"
                    :error="amountStatus"
                    )
            div.col-6.offset-1
                q-input(
                :float-label="$t('homePage.myWallet.send.toAddress')"
                v-model="formData.transactionTo"
                :error="transactionToStatus",
                )
        div.row.redeems
            div.col-3
                q-checkbox(v-model="showRedeem")  {{$t('homePage.myWallet.myAssets.redeem')}}
            div.col-6.offset-1(v-if="showRedeem")
                q-input(
                v-model="formData.redeemAddress"
                :error="redeemAddressStatus"
                :placeholder="$t('homePage.myWallet.myAssets.redeemDes')"
                )
        div.row.next-button
            div.col-2
                q-btn(
                color="light-blue-5"
                size="md"
                @click="submitTransaction"
                class='full-width'
                :disable="(!toBchStatus) || availableStatus || redeemAddressStatus || issuerDataStatus || amountStatus || transactionToStatus || minerFeesStatus || propertyDataStatus"
                ) {{$t('homePage.myWallet.myAssets.next')}}
</template>

<script>
import Balance from '../partials/Balance'
import { createNamespacedHelpers } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { Big } from 'big.js'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance, getWhcBalance, getTokenIds } from '../../../util/transform'
import request from '../../../util/request'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import { QSpinnerFacebook } from 'quasar'
import popup from '../../../util/notify'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
const { mapState } = createNamespacedHelpers('accountModule')
export default{
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
        transactionTo: '',
        selectedProperty: 0,
        propertyData: [],
        amount: ''
      },
      showRedeem: false,
      bchTransactionTo: [
        { address: '', amount: '' }
      ]
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
      },
      transactionTo: {
        required
      }
    }
  },
  computed: {
    ...mapState(['account_wallet']),
    // validate bch transaction_to
    toBchStatus: vm => {
      let bchTransactionTo = vm.bchTransactionTo
      let validateStatus = true
      if (vm.isBch) {
        validateStatus = bchTransactionTo.every((item) => {
          if (vm.validateBchAmount(item)) {
            return true
          }
        })
      }
      return validateStatus
    },
    isBch: vm => {
      if (!vm.propertyDataStatus) {
        let selectedCurrency = vm.propertyData[vm.formData.selectedProperty]
        if (selectedCurrency.type === 'BCH') {
          return true
        }
      }
      return false
    },
    // get bch balance
    bchBalance: vm => {
      let balance = ''
      if (vm.account_wallet.addresses) {
        balance = getBalance(vm.account_wallet.addresses[vm.formData.selectedAddress], vm.$store.state.walletModule.bch)
      }
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
    amountRange: vm => {
      let str
      if (!vm.propertyDataStatus && vm.tokenBalance.currency > 0) {
        let precision = parseInt(vm.propertyData[vm.formData.selectedProperty].precision)
        let begin
        let Range = -precision
        begin = Math.pow(10, Range)
        let balanceBig = new Big(vm.tokenBalance.currency)
        if (balanceBig.gte(begin)) {
          let endNum = balanceBig.valueOf()
          str = `${begin} ~ ${endNum} (precision = ${precision})`
        }
      } else {
        str = ''
      }
      return str
    },
    // get choose currency balance
    tokenBalance: vm => {
      let balanceData = { name: '', currency: '' }
      if (!vm.propertyDataStatus) {
        let selectedCurrency = vm.propertyData[vm.formData.selectedProperty]
        let bchAddress = vm.account_wallet.addresses[vm.formData.selectedAddress]
        if (vm.isBch) {
          balanceData.name = 'BCH'
          balanceData.currency = vm.bchBalance
        } else {
          let whc = vm.$store.state.walletModule.whc
          let balance = getWhcBalance(bchAddress, whc, selectedCurrency.propertyid)
          balanceData.name = selectedCurrency.label
          balanceData.currency = balance + ''
        }
      }
      return balanceData
    },
    // get tokens and bch
    propertyData: vm => {
      let data = []
      let bch = vm.$store.state.walletModule.bch
      data = getTokenIds(vm.account_wallet.addresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc, bch)
      return data
    },
    amountStatus: vm => {
      let amount = vm.formData.amount
      if (vm.isBch) { return false }
      if (isNum(amount) && vm.$v.formData.amount.required) {
        let amountBig = new Big(amount)
        if (amountBig.gte(0.00000001) && vm.tokenBalance.currency) {
          let tokenBalanceBig = new Big(vm.tokenBalance.currency)
          if (amountBig.lte(tokenBalanceBig)) {
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
    transactionToStatus: vm => {
      if (vm.isBch) { return false }
      return !vm.$v.formData.transactionTo.required
    },
    minerFeesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (vm.formData.minerFees >= 0.00000001))
    },
    propertyDataStatus: vm => {
      if (vm.propertyData.length === 0) {
        return true
      }
      return false
    },
    issuerDataStatus: vm => {
      if (vm.formData.issuerData.length === 0) {
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
    validateBchAmount (item) {
      let { amount, address } = item
      if (isNum(amount) && amount.trim() !== '' && (amount >= 0.00000546) && address.trim() !== '') {
        let index = amount.indexOf('.')
        let length
        if (index === -1) {
          return true
        }
        length = amount.split('.')[1].length
        if (length <= 8) {
          return true
        }
      }
      return false
    },
    removeAddress (index) {
      this.bchTransactionTo.splice(index, 1)
    },
    // add Address
    addAddress () {
      let item = { address: '', amount: '' }
      this.bchTransactionTo.push(item)
    },
    initSelectedProperty (type) {
      let item = { address: '', amount: '' }
      if (type === 'address') {
        this.formData.selectedProperty = 0
      }
      this.formData.minerFees = this.feeData.normal
      this.formData.amount = ''
      this.formData.transactionTo = ''
      this.showRedeem = false
      this.bchTransactionTo.splice(0)
      this.bchTransactionTo.push(item)
    },
    // assetCreation
    assetCreation () {
      let fee = new Big(this.formData.minerFees)
      let { transactionTo, selectedProperty, selectedAddress, redeemAddress, amount } = this.formData
      let transactionData
      let propertyData = this.propertyData
      let tData
      let type
      if (this.isBch) {
        let address = this.bchTransactionTo.map((item) => {
          return item.address
        })
        let amount = this.bchTransactionTo.map((item) => {
          return item.amount
        })
        tData = { address, amount }
        type = 'assemble'
      } else {
        tData = {
          transaction_version: 0,
          transaction_to: transactionTo,
          currency_identifier: propertyData[selectedProperty].propertyid,
          amount_to_transfer: amount + ''
        }
        type = 0
      }
      if (this.showRedeem) {
        tData.redeem_address = redeemAddress
      }
      transactionData = transaction(type, this.account_wallet.addresses[selectedAddress], fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    // validate redeem address
    addressValidate (veryRedeem = false) {
      let { redeemAddress, transactionTo } = this.formData
      try {
        if (veryRedeem) {
          isBCHCashAddress(redeemAddress)
        }
        if (this.isBch) {
          let bchTransactionTo = this.bchTransactionTo
          bchTransactionTo.forEach((item) => {
            isBCHCashAddress(item.address)
          })
        } else {
          isBCHCashAddress(transactionTo)
        }
        confirm(this, loadingOptions, this.assetCreation())
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    submitTransaction () {
      let { isBch, bchBalance, bchTransactionTo, showRedeem, addressValidate, formData } = this
      if (isBch) {
        let totalAmount
        if (bchTransactionTo.length === 1) {
          totalAmount = new Big(bchTransactionTo[0].amount).plus(formData.minerFees).valueOf()
        } else {
          totalAmount = new Big(bchTransactionTo[0].amount)
          bchTransactionTo.forEach((item, index) => {
            if (index !== 0) {
              totalAmount = totalAmount.plus(item.amount)
            }
          })
          totalAmount = totalAmount.valueOf()
        }
        if (parseFloat(totalAmount) > parseFloat(bchBalance)) {
          return popup.warning('not enough BCH', this)
        }
      }
      showRedeem ? addressValidate(true) : addressValidate()
    }
  },
  activated () {
    let bch = this.$store.state.walletModule.bch
    if (this.account_wallet.addresses && this.account_wallet.addresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.account_wallet.addresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
      this.getFees()
    }
  },
  deactivated () {
    this.$destroy()
  },
  components: { Balance }
}
</script>

<style lang="scss" scoped>
    .container {
        .validate-data {
            color: #db2828;
            font-size: 13px;
        }
        .topic {
            margin-top: 20px;
        }
        .next-button {
            margin-top: 30px;
        }
        .redeems {
            margin-top: 50px;
        }
        .remove {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .add {
            position: relative;
            margin-top: 30px;
            .add-icon {
                cursor: pointer;
            }
            div {
                margin-left: 10px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
