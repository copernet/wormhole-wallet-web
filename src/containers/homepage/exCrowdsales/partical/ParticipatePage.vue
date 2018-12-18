<template lang="pug">
    q-dialog(
    v-model="isOpen"
    class='smart-p-container'
    prevent-close)
        span(slot="title") {{$t('homePage.explorer.participate.subTitle')}}
         q-icon(name="close" class="absolute-right" @click.native="cancel" style="cursor: pointer; display: inline-block")
        div(slot="body")
            div.row
                div.col-12
                    q-input(
                    :float-label="labelTo"
                    v-model="transactionTo"
                    disabled readonly
                    )
            div.row
                div.col-12
                    q-select(:stack-label="labelIssuance" separator v-model="formData.selectedAddress" :options="formData.issuerData")
                    balance(:balance="whcBalance" currency="WHC" description=" ")
            div.row
                div.col-12
                    q-field(:error-label="amountRange")
                        q-input(
                            :float-label="labelTokenDes"
                            v-model="formData.amountToTransfer"
                            :error="amountStatus"
                            )
            div.row
                div.col-12
                    q-field(error-label=">= 0.00000001 BCH")
                        q-input(
                        :float-label="labelFees"
                        v-model="formData.minerFees"
                        :error="minerFeesStatus || availableStatus"
                        placeholder="0.002"
                        disabled readonly
                        )
            div(style="height: 5px")
            div.row
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.fast" :label="feeLabel.fast")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.normal" :label="feeLabel.normal")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.slow" :label="feeLabel.slow")
            div(style="height: 15px")
            div.row
                q-checkbox(v-model="showRedeem")  {{$t('homePage.myWallet.myAssets.redeem')}}
            div.row(v-if="showRedeem")
                div.col-12
                    q-input(
                    v-model="formData.redeemAddress"
                    :error="redeemAddressStatus"
                    )
        template(slot="buttons" slot-scope="props")
            q-btn(color="primary"
            size="md"
            @click="submitTransaction"
            class='full-width'
            :disable="availableStatus || toAddressStatus|| amountStatus || minerFeesStatus || issuerDataStatus || redeemAddressStatus"
            ) {{$t('homePage.myWallet.myAssets.next')}}
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import Balance from '../../partials/Balance'
import { Big } from 'big.js'
import { transaction, confirm } from '../../../../util/transaction'
import request from '../../../../util/request'
import { isBCHCashAddress } from '../../../../util/bchNetWork'
import { clearForm, isNum, getBalance, getWhcBalance } from '../../../../util/transform'
import { QSpinnerFacebook } from 'quasar'
import popup from '../../../../util/notify'

import QField from 'quasar-framework/src/components/field/QField'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
const { mapState } = createNamespacedHelpers('accountModule')
export default {
  components: { QField, QIcon, Balance },
  data () {
    return {
      labelTokenDes: this.$t('homePage.explorer.participate.sendAmount'),
      labelIssuance: this.$t('homePage.explorer.participate.fromAddress'),
      labelFees: this.$t('homePage.explorer.participate.fees'),
      labelTo: this.$t('homePage.explorer.participate.toAddress'),
      feeLabel: {
        fast: this.$t('homePage.myWallet.choseFees.fast'),
        normal: this.$t('homePage.myWallet.choseFees.normal'),
        slow: this.$t('homePage.myWallet.choseFees.slow')
      },
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      formData: {
        amountToTransfer: '',
        selectedAddress: 0,
        minerFees: '',
        issuerData: [],
        redeemAddress: ''
      },
      showRedeem: false
    }
  },
  validations: {
    formData: {
      amountToTransfer: {
        required
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
    ...mapState(['account_wallet']),
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
    // get whc balance
    whcBalance: vm => {
      let balance = ''
      if (vm.account_wallet.addresses) {
        balance = getWhcBalance(vm.account_wallet.addresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc)
      }
      return balance
    },
    amountRange: vm => {
      let str
      let begin
      begin = 0.00000001
      if (vm.whcBalance >= begin) {
        str = `${begin} ~ ${vm.whcBalance}`
      } else {
        str = 'need whc'
      }
      return str
    },
    minerFeesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (vm.formData.minerFees >= 0.00000001))
    },
    issuerDataStatus: vm => {
      if (vm.formData.issuerData.length === 0) {
        return true
      }
      return false
    },
    toAddressStatus: vm => {
      if (!vm.transactionTo) {
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
    amountStatus: vm => {
      let { amountToTransfer } = vm.formData
      let precision = 8
      if (isNum(amountToTransfer) && vm.$v.formData.amountToTransfer.required) {
        let amountBig = new Big(amountToTransfer)
        let maxBig = new Big((vm.whcBalance + ''))
        if (amountBig.gte(0.00000001)) {
          if (amountBig.lte(maxBig)) {
            let index = amountToTransfer.indexOf('.')
            let length
            if (index === -1) { return false }
            length = amountToTransfer.split('.')[1].length
            if (length <= precision) { return false }
          }
        }
      }
      return true
    }
  },
  props: [ 'isOpen', 'transactionTo', 'precision' ],
  methods: {
    // get fee status
    getFees () {
      request.getTranscationFees().then((data) => {
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
        popup.warning(error, this)
      })
    },
    // assetCreation
    assetCreation () {
      let fee = new Big(this.formData.minerFees)
      let { selectedAddress } = this.formData
      let transactionData
      let tData
      if (!this.account_wallet.addresses) {
        return false
      }
      tData = {
        transaction_version: 0,
        amount_to_transfer: this.formData.amountToTransfer + '',
        transaction_to: this.transactionTo
      }
      if (this.showRedeem) {
        tData.redeem_address = this.formData.redeemAddress
      }
      transactionData = transaction(1, this.account_wallet.addresses[selectedAddress], fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    // cancel trade
    cancel () {
      this.$emit('cancel')
      clearForm('Participate', this)
    },
    // validate redeem address
    redeemValidate () {
      try {
        isBCHCashAddress(this.formData.redeemAddress)
        confirm(this, loadingOptions, this.assetCreation())
      } catch (e) {
        popup.warning(e.message, this)
      }
    },
    submitTransaction () {
      this.showRedeem ? this.redeemValidate() : confirm(this, loadingOptions, this.assetCreation())
    }
  },
  activated () {
    let bch = this.$store.state.walletModule.bch
    if (this.account_wallet.addresses && this.account_wallet.addresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.account_wallet.addresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
      this.formData.selectedAddress = 0
    }
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" >
    .smart-p-container{
        .modal-scroll {
            max-height: 45rem!important;
        }
    }
</style>
