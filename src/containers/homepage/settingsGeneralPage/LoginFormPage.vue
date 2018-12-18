<template lang="pug">
    q-dialog(
    v-model="isOPen"
    @hide="onHide"
    prevent-close)
        span(slot="title") {{$t('homePage.accountSetting.verifyCurrentPass')}}
         q-icon(name="close" class="absolute-right" @click.native="cancel" style="cursor: pointer; display: inline-block")
        div(slot="body")
            q-field(:error="errorUUIDShown" :error-label="errorUUIDTips")
                q-input(:float-label="labelUUID" v-model:trim="valueUUID" @blur='eventBlurUUID')
            div.usname-helper {{usernameHelper}}
            q-field(:error="errorPassShown" :error-label="errorPassTips")
                q-input(type="password" :float-label="labelPassword" v-model:trim="valuePassword" @blur='eventBlurPass')
            div(v-if='mfaContainerShown')
                <q-checkbox v-model="checkboxValue"  :label="labelUsingMfa" left-label class='checkbox-container'/>
                    q-tooltip {{$t('account.mfaTips')}}
            q-field(:error="errorMfaShown" :error-label="labelRequired" v-if='mfaShown')
                        q-input(:float-label="labelMFA" v-model:trim="valueMFA")
        template(slot="buttons" slot-scope="props")
            q-btn(color="tertiary"
            size="md"
            @click="validate"
            class='full-width'
            :disable="!loginEnable"
            :loading='loadingValidate'
            ) {{$t('common.validate')}}
</template>

<script>
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import popup from '../../../util/notify'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('accountModule')
let { warning } = popup
export default {
  components: { QIcon },
  data () {
    return {
      labelUUID: this.$t('account.username') || 'username',
      labelPassword: this.$t('account.password') || 'password',
      usernameHelper: this.$t('account.usernameHelper') || '',
      labelRequired: this.$t('account.required'),
      labelMFA: this.$t('homePage.accountSetting.mfa.mfacode'),
      valuePassword: '',
      errorUUIDTips: '',
      errorPassTips: '',
      valueMFA: '',
      loadingValidate: false,
      labelUsingMfa: this.$t('account.usingMfa'),
      checkboxValue: false
    }
  },
  computed: {
    ...mapState(['account_mfa', 'account_uuid']),
    mfaContainerShown () {
      return !this.account_mfa
    },
    errorUUIDShown () {
      return this.errorUUIDTips.length > 0
    },
    errorPassShown () {
      return this.errorPassTips.length > 0
    },
    errorMfaShown () {
      return !(this.valueMFA.length > 0)
    },
    mfaShown () {
      return this.account_mfa || this.checkboxValue
    },
    valueUUID () {
      return this.account_uuid || ''
    },
    loginEnable () {
      if (this.mfaShown) {
        return this.valueUUID.length !== 0 && this.valuePassword.length !== 0 && !this.errorUUIDShown && !this.errorPassShown && !this.errorMfaShown
      } else {
        return this.valueUUID.length !== 0 && this.valuePassword.length !== 0 && !this.errorUUIDShown && !this.errorPassShown
      }
    }
  },
  props: [ 'isOPen', 'loginType' ],
  methods: {
    ...mapActions(['account_login']),
    validate () {
      var self = this
      let params = {
        uuid: self.valueUUID,
        passphrase: self.valuePassword
      }
      if (self.mfaShown) {
        params.mfatoken = self.valueMFA
      }
      self.loadingValidate = true
      self.account_login(params).then(result => {
        self.loadingValidate = false
        switch (result.code) {
          case 0:
            this.$emit('loginCancel')
            self.valuePassword = ''
            // emit different event by the different page
            switch (self.loginType) {
              case 'CHANGEPASS':
                self.$emit('openChangeAtLogin')
                break
              case 'SETUPMFA':
                self.$emit('openSetupAtLoginEmit')
                break
              case 'EMAILFORLOGIN':
                self.$emit('openEmailAtLoginEmit')
                break
            }
            break
          case 2406:
            warning(result.message, self)
            self.mfaShown = true
            break
          default:
            warning(result.message, self)
            break
        }
      }).catch(error => {
        self.loadingValidate = false
        if (error && error.badPassword) {
          warning(self.$t('account.invalidCredential'), self)
        } else {
          warning(error, self)
        }
      })
    },
    eventBlurUUID () {
      if (this.valueUUID.length === 0) {
        this.errorUUIDTips = this.$t('account.required')
      } else {
        this.errorUUIDTips = ''
      }
    },
    eventBlurPass () {
      if (this.valuePassword.length === 0) {
        this.errorPassTips = this.$t('account.required')
      } else {
        this.errorPassTips = ''
      }
    },
    cancel () {
      this.$emit('loginCancel')
      this.valuePassword = ''
      this.valueMFA = ''
      this.checkboxValue = false
    },
    onHide () {
      this.$emit('loginCancel')
      this.valuePassword = ''
      this.valueMFA = ''
      this.checkboxValue = false
    }
  }
}
</script>

<style lang="scss" scoped>
    .checkbox-container{
      font-size: 13px;
      margin-top: 10px;
    }
</style>
