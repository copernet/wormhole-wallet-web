<template lang="pug">
    q-dialog(
    v-model="isOPen"
    prevent-close)
        span(slot="title") {{$t('homePage.accountSetting.changePass')}}
         q-icon(name="close" class="absolute-right" @click.native="cancel" style="cursor: pointer; display: inline-block")
        div(slot="body")
            q-field(:error="errorPassShown" :error-label="errorPassTips")
                q-input(type="password" :float-label="labelPassword" v-model:trim="valuePassword" @blur='eventBlurPassword' @input='eventInputPassword')
            q-field(:error="errorConPassShown" :error-label="errorConPassTips")
                q-input(type="password" :float-label="labelConPassword" v-model:trim="valueConPassword" @blur='eventBlurConPassword' @input='eventInputConPassword')

        template(slot="buttons" slot-scope="props")
            q-btn(color="tertiary"
            size="md"
            @click="change"
            class='full-width'
            :disable="btnDisable"
            :loading='loadingChange'
            ) {{$t('common.change')}}
</template>

<script>
import QIcon from 'quasar-framework/src/components/icon/QIcon'
// import popup from '../../../util/notify'
import { createNamespacedHelpers } from 'vuex'
import commonUtil from '../../../../src/util/common'
import cryptoUtil from '../../../../src/util/cryptoUtil'
import request from '../../../../src/util/request'
import popup from '../../../../src/util/notify'
let { warning, ok } = popup
const { mapActions, mapMutations, mapState } = createNamespacedHelpers('accountModule')
export default {
  components: { QIcon },
  data () {
    return {
      labelPassword: this.$t('account.password'),
      labelConPassword: this.$t('account.confirmPassword'),
      valuePassword: '',
      valueConPassword: '',
      errorPassTips: '',
      errorConPassTips: '',
      loadingChange: false
    }
  },
  computed: {
    ...mapState(['account_uuid']),
    errorPassShown () {
      return this.errorPassTips.length > 0
    },
    errorConPassShown () {
      return this.errorConPassTips.length > 0
    },
    btnDisable () {
      if (this.valuePassword.length !== 0 && this.valueConPassword.length !== 0 && !this.errorPassShown && !this.errorConPassShown) {
        return false
      }
      return true
    }
  },
  props: [ 'isOPen' ],
  methods: {
    ...mapMutations(['set_account_walletkey']),
    ...mapActions(['account_saveSession']),
    change () {
      var self = this
      self.loadingChange = true
      request.wallet_challenge(self.account_uuid).then(resData => {
        if (resData.code === 0) {
          self.set_account_walletkey(cryptoUtil.generateSymmetricKey(self.valueConPassword, resData.result.salt))
          self.account_saveSession().then(resData => {
            self.loadingChange = false
            if (resData && resData.code === 0) {
              ok(self.$t('tips.updateSuccess'), self)
              self.$emit('changeCancel')
            } else {
              warning(resData.message, self)
            }
          }).catch(error => {
            self.loadingChange = false
            warning(error, self)
          })
        } else {
          self.loadingChange = false
          warning(resData.message, self)
        }
      }).catch((error) => {
        self.loadingChange = false
        warning(error, self)
      })
    },
    eventBlurPassword () {
      let tip = ''
      if (this.valuePassword.length === 0) {
        tip = this.$t('account.required')
      } else {
        tip = (commonUtil.validatePassword(this.valuePassword) ? '' : this.$t('account.invalidPassword'))
      }
      this.errorPassTips = tip
    },
    eventInputPassword () {
      if (commonUtil.validatePassword(this.valuePassword)) {
        this.errorPassTips = ''
      }
    },
    eventBlurConPassword () {
      if (this.valueConPassword.length === 0) {
        this.errorConPassTips = this.$t('account.required')
      }
    },
    eventInputConPassword () {
      this.errorConPassTips = (this.valueConPassword === this.valuePassword ? '' : this.$t('account.passNoMath'))
    },
    cancel () {
      this.$emit('changeCancel')
      this.valuePassword = ''
      this.valueConPassword = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
