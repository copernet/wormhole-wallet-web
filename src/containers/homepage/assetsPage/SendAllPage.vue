<template lang="pug">
    div.container.smart-p-container.topic
        div.q-title {{$t('homePage.myWallet.sendAll.title')}}
            a(
                :title="$t('homePage.myWallet.myAssets.protocol')"
                target="_blank" href="https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#transfer-all-tokens-4"
                style="text-decoration: none;"
                )
                q-icon.whc-protocol(name="help_outline")
                    q-tooltip(anchor="bottom middle" self="top left") {{$t('homePage.myWallet.myAssets.protocol')}}
        div
            div.row
                div.col-10
                    q-input(
                    :float-label="$t('homePage.myWallet.sendAll.toAddress')"
                    v-model="formData.transactionTo"
                    :error="transactionToStatus"
                    )
            div.row
                div.col-10
                    q-select(
                    :stack-label="$t('homePage.myWallet.sendAll.fromAddress')"
                    separator
                    v-model="formData.selectedAddress"
                    :options="formData.issuerData"
                    )
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
                :disable="availableStatus || transactionToStatus || minerFeesStatus || issuerDataStatus || redeemAddressStatus"
                ) {{$t('homePage.myWallet.myAssets.next')}}
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import { Big } from 'big.js'
import { transaction, confirm } from '../../../util/transaction'
import { isBCHCashAddress } from '../../../util/bchNetWork'
import { isNum, getBalance } from '../../../util/transform'
import request from '../../../util/request'
import { QSpinnerFacebook } from 'quasar'
import popup from '../../../util/notify'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  components: { QIcon },
  data () {
    return {
      feeLabel: {
        fast: this.$t('homePage.myWallet.choseFees.fast'),
        normal: this.$t('homePage.myWallet.choseFees.normal'),
        slow: this.$t('homePage.myWallet.choseFees.slow')
      },
      formData: {
        selectedAddress: 0,
        minerFees: '',
        issuerData: [],
        redeemAddress: '',
        transactionTo: ''
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
      redeemAddress: {
        required
      },
      transactionTo: {
        required
      },
      minerFees: {
        required
      }
    }
  },
  computed: {
    // get bch balance
    bchBalance: vm => {
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
    minerFeesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (vm.formData.minerFees >= 0.00000001))
    },
    transactionToStatus: vm => { return !vm.$v.formData.transactionTo.required },
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
    customerAddresses: vm => {
      return vm.$store.state.accountModule.account_wallet.addresses || ''
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
      let { selectedAddress, transactionTo, redeemAddress } = this.formData
      let transactionData
      if (this.showRedeem) {
        transactionData = transaction(4, this.customerAddresses[selectedAddress], fee, {
          transaction_version: 0,
          ecosystem: 1,
          redeem_address: redeemAddress,
          transaction_to: transactionTo
        })
      } else {
        transactionData = transaction(4, this.customerAddresses[selectedAddress], fee, {
          transaction_version: 0,
          ecosystem: 1,
          transaction_to: transactionTo
        })
      }
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
        isBCHCashAddress(transactionTo)
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
    }
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .topic {
        /*margin-top: 20px;*/
    }
    .tips{
        color: red;
        font-size: 16px;
        margin-top: 5px;
    }
    .blank {
        margin-top: 15px;
    }
    .whc-protocol {
        color: #027be3;
        font-size: 18px;
        margin-left: 10px;
    }
</style>
