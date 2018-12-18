<template lang="pug">
    div
        q-dialog(v-model="isOpen" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            span(slot="title") {{$t('homePage.overview.export.title')}}
            div(slot="message")
                span(slot="message") {{$t('common.walletId')}} : {{walletId}}
            div(slot='body')
                q-field(:error="errorBackupShown" :error-label="label.required" orientation='vertical')
                    q-input(:float-label="label.backname" v-model:trim="backNameInput")
                q-field(:error="errorPassShown" :error-label="label.required" orientation='vertical')
                    q-input(type="password" :float-label="label.enterPass" v-model:trim="valuePassword")
                q-field(:error="errorMfaShown" error-label="label.required" v-if='mfaShown')
                        q-input(:float-label="labelMFA" v-model:trim="valueMFA")
            template(slot="buttons" slot-scope="props")
                    q-btn(flat :label="label.validate" @click.native="validate" color='black' :disable='!validateBtnEnable')
                    q-btn(flat :label="label.cancel" @click="props.cancel")
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import popup from '../../../../src/util/notify'
import cryptoUtil from '../../../../src/util/cryptoUtil'
import bch from 'bitcore-lib-cash'
import { saveAs } from 'file-saver/FileSaver'
import { QSpinnerFacebook } from 'quasar'
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }

// import addressUtil from '../../../../src/util/address'
const { mapState, mapActions } = createNamespacedHelpers('accountModule')
let { warning } = popup
export default {
  data () {
    return {
      label: {
        cancel: this.$t('common.cancel'),
        validate: this.$t('common.validate'),
        backname: this.$t('homePage.overview.export.backUpName'),
        enterPass: this.$t('homePage.overview.export.enterPass'),
        required: this.$t('account.required')
      },
      backNameInput: '',
      valuePassword: '',
      exportedArr: [],
      valueMFA: '',
      labelMFA: this.$t('homePage.accountSetting.mfa.mfacode')
    }
  },
  computed: {
    ...mapState(['account_wallet', 'account_uuid', 'account_walletKeyTemp', 'account_mfa']),
    errorBackupShown () {
      return !(this.backNameInput.length > 0)
    },
    errorPassShown () {
      return !(this.valuePassword.length)
    },
    errorMfaShown () {
      return !(this.valueMFA.length > 0)
    },
    mfaShown () {
      return this.account_mfa
    },
    validateBtnEnable () {
      if (self.mfaShown) {
        return !this.errorBackupShown && !this.errorPassShown && !this.errorMfaShown
      } else {
        return !this.errorBackupShown && !this.errorPassShown
      }
    },
    walletId () {
      return this.account_uuid
    }
  },
  props: [ 'isOpen' ],
  methods: {
    ...mapActions(['account_verify']),
    onHide () {
      this.backNameInput = ''
      this.valuePassword = ''
      this.$emit('backupEmit')
    },
    onCancel () {
      this.$emit('backupEmit')
      this.backNameInput = ''
      this.valuePassword = ''
      this.isOpen = false
    },
    validate () {
      let self = this
      let params = {
        uuid: self.account_uuid,
        passphrase: self.valuePassword
      }
      if (self.mfaShown) {
        params.mfatoken = self.valueMFA
      }
      self.$q.loading.show(loadingOptions)
      self.account_verify(params).then(resData => {
        switch (resData.code) {
          case 0:
            var data = resData.result
            try {
              let wallet = cryptoUtil.decryptObject(data.wallet, self.account_walletKeyTemp)
              let walletAddresses = wallet.addresses
              var exported = 0
              var total = walletAddresses.length
              var blob = {
                addresses: []
              }
              let next = function () {
                return exportAddress(walletAddresses[exported])
              }
              var exportAddress = function (obj) {
                if (exported === total) {
                  let exportBlob = new Blob([JSON.stringify(blob)], {
                    type: 'application/json;charset=utf-8'
                  })
                  let fileName = self.backNameInput + '.json'
                  saveAs(exportBlob, fileName)
                  self.$q.loading.hide()
                  self.$emit('backStatusObjEmit', self.exportedArr)
                  return
                }
                let item = {}
                try {
                  if (obj.privkey) {
                    var CashAddrForm = bch.Address.CashAddrFormat
                    var privateKey = new bch.PrivateKey(obj.privkey)
                    var addr = privateKey.toAddress().toString(CashAddrForm)
                    blob.addresses.push({
                      address: addr,
                      privkey: obj.privkey,
                      pubkey: obj.pubkey
                    })
                    item.message = self.$t('homePage.overview.export.tradeTip')
                    item.status = 'success'
                    item.address = obj.address
                    item.icon = 'done'
                    item.color = 'primary'
                  }
                  if ((!obj.privkey && !obj.pubkey)) {
                    blob.addresses.push({
                      address: obj.address,
                      privkey: '',
                      pubkey: ''
                    })
                    item.message = self.$t('homePage.overview.export.watchTip')
                    item.status = 'success'
                    item.address = obj.address
                    item.icon = 'done'
                    item.color = 'primary'
                  }
                  if ((!obj.privkey && obj.pubkey)) {
                    blob.addresses.push({
                      address: obj.address,
                      privkey: '',
                      pubkey: obj.pubkey
                    })
                    item.message = self.$t('homePage.overview.export.offlineTip')
                    item.status = 'success'
                    item.address = obj.address
                    item.icon = 'done'
                    item.color = 'primary'
                  }
                } catch (e) {
                  self.$q.loading.hide()
                  item.message = self.$t('homePage.overview.export.error') + ' ' + e
                  item.status = 'fail'
                  item.address = obj.address
                  item.icon = 'close'
                  item.color = 'amber'
                }
                self.exportedArr.push(item)
                exported++
                return next()
              }
              next()
            } catch (e) {
              self.$q.loading.hide()
              warning(self.$t('homePage.overview.export.errorDecrypt'), self)
            }
            break
          case 2406:
            self.mfaShown = true
            warning(resData.message, self)
            break
          default:
            warning(resData.message, self)
            break
        }
      }).catch(error => {
        warning(error, self)
        warning(self.$t('homePage.overview.export.errorDecrypt'), self)
      })
    }

  },
  activated () {
    this.exportedArr = []
  }
}
</script>

<style lang="scss" scoped>

</style>
