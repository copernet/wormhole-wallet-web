<template lang="pug">
    q-dialog(
    v-model="isOpen"
    class='owner-container'
    prevent-close)
        span(slot="title") {{operatesData.Status ? 'Unfreeze Asset' : 'Freeze Asset'}}
          q-icon(name="close" class="absolute-right" @click.native="cancel" style="cursor: pointer; display: inline-block")
        div(slot="body")
            div.row
                div.col-12
                    q-input(
                    :float-label="$t('homePage.owners.address')"
                    v-model="detailData.selectedAddress"
                    disabled readonly
                    )
            div.row
                div.col-12
                    q-input(
                    :float-label="$t('homePage.owners.ownerAddress')"
                    v-model="operatesData.Address"
                    disabled readonly
                    )
            div.row
                div.col-12
                    q-input(
                    :float-label="$t('homePage.owners.id')"
                    v-model="detailData.propertyid"
                    disabled readonly
                    )
            div.row
                div.col-12
                    q-input(
                    :float-label="$t('homePage.owners.name')"
                    v-model="detailData.propertyName"
                    disabled readonly
                    )
            div.row
                div.col-12
                    q-field(error-label="not enough BCH")
                        q-input(
                        :float-label="$t('homePage.explorer.participate.fees')"
                        v-model="minerFees"
                        :error="availableStatus"
                        disabled readonly
                        )
            div(style="height: 10px")
            div.row
                div.col-4
                    q-radio(v-model="minerFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                div.col-4
                    q-radio(v-model="minerFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                div.col-4
                    q-radio(v-model="minerFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
            div(style="height: 15px")
        template(slot="buttons" slot-scope="props")
            q-btn(color="primary"
            size="md"
            :disable="availableStatus"
            @click="submitTransaction"
            class='full-width'
            ) Confirm
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { QSpinnerFacebook } from 'quasar'
import { Big } from 'big.js'

import request from '../../../util/request'
import popup from '../../../util/notify'
import { getBalance } from '../../../util/transform'
import { transaction, confirm } from '../../../util/transaction'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
const { mapState } = createNamespacedHelpers('accountModule')
export default {
  data () {
    return {
      minerFees: '',
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      }
    }
  },
  props: [ 'isOpen', 'operatesData', 'detailData' ],
  computed: {
    ...mapState(['account_wallet']),
    // get bch balance
    bchBalance: vm => {
      let balance = ''
      if (vm.account_wallet.addresses) {
        balance = getBalance(vm.getAddressItem(), vm.$store.state.walletModule.bch)
      }
      return balance
    },
    availableStatus: vm => {
      let { minerFees } = vm
      if (minerFees) {
        if (minerFees <= vm.bchBalance) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    getFees () {
      request.getTranscationFees().then((data) => {
        this.minerFees = ''
        if (data.code === 0) {
          let result = data.result
          this.feeData.fast = result.Fast + ''
          this.feeData.normal = result.Normal + ''
          this.feeData.slow = result.Slow + ''
          this.minerFees = this.feeData.normal
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        popup.warning(error, this)
      })
    },
    getAddressItem () {
      let { selectedAddress } = this.detailData
      let addr = this.account_wallet.addresses.filter((item) => {
        if (item.address === selectedAddress) {
          return item
        }
      })[0]
      return addr
    },
    assetCreation () {
      let fee = new Big(this.minerFees)
      let transactionData
      let tData
      let { selectedAddress, propertyid } = this.detailData
      // eslint-disable-next-line
      let { Address, balance_available, Status } = this.operatesData
      if (!this.account_wallet.addresses) {
        return false
      }
      tData = {
        transaction_version: 0,
        transaction_from: selectedAddress,
        property_id: propertyid,
        amount: balance_available,
        frozen_address: Address
      }
      transactionData = Status ? transaction(186, this.getAddressItem(), fee, tData) : transaction(185, this.getAddressItem(), fee, tData)
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    cancel () {
      this.$emit('cancel')
      this.minerFees = this.feeData.normal
    },
    submitTransaction () {
      confirm(this, loadingOptions, this.assetCreation())
    }
  },
  mounted () {
    this.getFees()
  }
}
</script>

<style lang="scss">
    .owner-container {
        .modal-scroll {
            max-height: 450rem !important;
            width: 500px;
            overflow: hidden;
        }
    }
</style>
