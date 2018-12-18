<template lang="pug">
    div.smart-p-container.container
        div.q-title.topic {{$t('homePage.myWallet.myAssets.title')}}
            a(
                :title="$t('homePage.myWallet.myAssets.protocol')"
                target="_blank" href="https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#issuance-of-whc-68"
                style="text-decoration: none;"
                )
                q-icon.whc-protocol(name="help_outline")
                    q-tooltip(anchor="bottom middle" self="top left") {{$t('homePage.myWallet.myAssets.protocol')}}
        div.row
            div.col-10
                q-input(
                :float-label="$t('homePage.myWallet.myAssets.tokenDes')"
                v-model="formData.amount_for_burn"
                :error="amountStatus"
                )
        div.tips(v-if="amountStatus") 1~21000000 BCH
        div
            div.row
                div.col-10
                    q-input(
                    :float-label="$t('homePage.myWallet.myAssets.fees')"
                    v-model="formData.minerFees"
                    :error="minerFeesStatus || availableStatus"
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
        div.row
            div.col-10
                q-select(:stack-label="$t('homePage.myWallet.myAssets.issuance')" separator v-model="formData.selectedAddress" :options="formData.issuerData")
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
        div(style="height: 30px")
        div.row
            div.col-2
                q-btn(color="light-blue-5"
                size="md"
                @click="submitTransaction"
                class='full-width'
                :disable="availableStatus || amountStatus || minerFeesStatus || issuerDataStatus || redeemAddressStatus"
                ) {{$t('homePage.myWallet.myAssets.next')}}
</template>

<script>
import { required, between } from 'vuelidate/lib/validators'
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import { Big } from 'big.js'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance } from '../../../util/transform'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import { QSpinnerFacebook } from 'quasar'
import request from '../../../util/request'
import popup from '../../../util/notify'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  components: { QIcon },
  data () {
    return {
      formData: {
        amount_for_burn: '',
        selectedAddress: 0,
        minerFees: '',
        issuerData: [],
        redeemAddress: ''
      },
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      showRedeem: false
    }
  },
  validations: {
    formData: {
      amount_for_burn: {
        required,
        between: between(1, 21000000)
      },
      redeemAddress: {
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
    amountStatus: vm => {
      return !(isNum(vm.formData.amount_for_burn) && vm.$v.formData.amount_for_burn.required && vm.$v.formData.amount_for_burn.between)
    },
    minerFeesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (parseFloat(vm.formData.minerFees) >= 0.00000001))
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
    },
    // get bch balance
    bchBalance: vm => {
      if (vm.customerAddresses) {
        let balance = getBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.bch)
        return balance
      } else {
        return ''
      }
    },
    availableStatus: vm => {
      /* eslint-disable */
      let { minerFees, amount_for_burn } = vm.formData
      if (isNum(amount_for_burn) && minerFees && amount_for_burn !== '') {
        let cost = new Big(minerFees).plus(amount_for_burn).valueOf()
        if (cost <= vm.bchBalance) {
          return false
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
          this.formData.minerFees = result.Normal + ''
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    },
    // assetCreation
    assetCreation () {
      let fee = new Big(this.formData.minerFees)
      let { selectedAddress } = this.formData
      let transactionData
      if (!this.customerAddresses) {
        return false
      }
      if (this.showRedeem) {
        transactionData = transaction(68, this.customerAddresses[selectedAddress], fee, {
          transaction_version: 0,
          amount_for_burn: this.formData.amount_for_burn,
          redeem_address: this.formData.redeemAddress
        })
      } else {
        transactionData = transaction(68, this.customerAddresses[selectedAddress], fee, {
          transaction_version: 0,
          amount_for_burn: this.formData.amount_for_burn
        })
      }
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    // validate redeem address
    redeemValidate () {
      try {
        isBCHCashAddress(this.formData.redeemAddress)
        confirm(this, loadingOptions, this.assetCreation(), false)
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    submitTransaction () {
      this.showRedeem ? this.redeemValidate() : confirm(this, loadingOptions, this.assetCreation(), false, true)
    }
  },
  activated () {
    let bch = this.$store.state.walletModule.bch
    if (this.customerAddresses && this.customerAddresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.customerAddresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
    }
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" >
    .smart-p-container {
        .topic {
            /*margin-top: 20px;*/
        }
        .tips {
            color: red;
            font-size: 16px;
            margin-top: 5px;
        }
        .blank {
            margin-top: 20px;
        }
        .whc-protocol {
            color: #027be3;
            font-size: 18px;
            margin-left: 10px;
        }
    }
    .q-item-letter {
        font-size: 16px;
    }
</style>
