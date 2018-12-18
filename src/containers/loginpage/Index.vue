<template lang="pug">
    q-layout.container
        q-toolbar.nav-container
            a(href='#/')
                img.wormhole-logo(src="../../../public/img/logo_top.png")
        div.content-container
            div.form-container
                div(class='row form-tittle')
                    div(class='col-8')
                        p {{$t('account.formTittle')}}
                    div(class='col-4 text-right sign-up')
                        span or
                        span(@click="signUp" v-if='isRelease') {{$t('account.signUp')}}
                div.sign-container
                    q-field(:error="errorUUIDShown" :error-label="errorUUIDTips" )
                        q-input(:float-label="labelUUID" v-model:trim="valueUUID" @blur='eventBlurUUID')
                    div.usname-helper {{usernameHelper}}
                    q-field(:error="errorPassShown" :error-label="errorPassTips")
                        q-input(type="password" :float-label="labelPassword" v-model:trim="valuePassword" @blur='eventBlurPass')
                    div
                        q-checkbox(v-model="checkboxValue"  :label="labelUsingMfa" left-label class='checkbox-container')
                            q-tooltip {{$t('account.mfaTips')}}
                    q-field(:error="errorMfaShown" :error-label="labelRequired" v-if='mfaShown')
                        q-input(:float-label="labelMFA" v-model:trim="valueMFA")
                div.row
                    q-btn.log-btn(color="primary" class="full-width" @click="login" :disable='!loginEnalbe' :loading='loadingLogin') {{this.$t('account.login')}}

</template>

<script>
import QLayout from 'quasar-framework/src/components/layout/QLayout'
import popup from '../../../src/util/notify'
import request from '../../util/request'
import bch from 'bitcoincashjs'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Promise } from 'bluebird'
let { warning, ok } = popup
export default {
  components: { QLayout },
  data () {
    return {
      labelUUID: this.$t('account.username'),
      labelPassword: this.$t('account.password'),
      usernameHelper: this.$t('account.usernameHelper') || '',
      labelRequired: this.$t('account.required'),
      labelMFA: this.$t('homePage.accountSetting.mfa.mfacode'),
      valuePassword: '',
      errorUUIDTips: '',
      errorPassTips: '',
      mfaShown: false,
      valueUUID: '',
      valueMFA: '',
      loadingLogin: false,
      labelUsingMfa: this.$t('account.usingMfa'),
      checkboxValue: false,
      isRelease: true
    }
  },
  computed: {
    ...mapState({
      account_uuid: state => state.accountModule.account_uuid
    }),
    errorUUIDShown () {
      return this.errorUUIDTips.length > 0
    },
    errorPassShown () {
      return this.errorPassTips.length > 0
    },
    errorMfaShown () {
      return !(this.valueMFA.length > 0)
    },
    loginEnalbe () {
      if (this.mfaShown) {
        return this.valueUUID.length !== 0 && this.valuePassword.length !== 0 && !this.errorUUIDShown && !this.errorPassShown && !this.errorMfaShown
      } else {
        return this.valueUUID.length !== 0 && this.valuePassword.length !== 0 && !this.errorUUIDShown && !this.errorPassShown
      }
    }
  },
  watch: {
    checkboxValue () {
      if (this.checkboxValue) {
        this.mfaShown = true
      } else {
        this.mfaShown = false
      }
    }
  },
  methods: {
    ...mapMutations(['configModule/set_nethasfetched']),
    ...mapActions(['accountModule/account_login', 'configModule/config_nethasfetched_action']),
    login () {
      var self = this
      let params = {
        uuid: self.valueUUID,
        passphrase: self.valuePassword
      }
      if (self.mfaShown) {
        params.mfatoken = self.valueMFA
      }
      self.loadingLogin = true
      self.fetchNetStatus().then(resData => {
        if (resData.code === 0) {
          self['accountModule/account_login'](params).then(result => {
            self.loadingLogin = false
            switch (result.code) {
              case 0:
                ok(self.$t('tips.loginSuccess'), self)
                // self.fetchNetStatus()
                self.$router.push('/home')
                break
              case 2406:
                warning(result.message, self)
                self.checkboxValue = true
                self.mfaShown = true
                break
              default:
                warning(result.message, self)
                break
            }
          }).catch(error => {
            self.loadingLogin = false
            if (error && error.badPassword) {
              warning(self.$t('account.invalidCredential'), self)
            } else {
              warning(error, self)
            }
          })
        } else {
          self.loadingLogin = false
          warning(resData.message, self)
        }
      }).catch(error => {
        self.loadingLogin = false
        warning(error, self)
      })
    },
    signUp () {
      this.$router.push('/signup')
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
    fetchNetStatus () {
      var self = this
      return new Promise((resolve, reject) => {
        request.get_env().then(resData => {
          if (resData.code === 0) {
            let data = resData.result
            if (typeof (data.testnet) !== 'undefined') {
              self['configModule/set_nethasfetched'](true)
              if (data.testnet) {
                bch.Networks.defaultNetwork = bch.Networks.testnet
              } else {
                bch.Networks.defaultNetwork = bch.Networks.mainnet
              }
            }
            resolve(resData)
          } else {
            resolve(resData)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .wormhole-logo {
        height: 36px;
        margin-top: 20px;
        padding-left: 30px;
    }
    .content-container{
      display: flex;
      justify-content: center;
      margin-top: 10%;
    }
    .container {
        background: #17244f;
        .nav-container{
          background-color: #17244f!important;
        }
        .form-container {
            background-color: #fff;
            width: 400px;
            padding: 20px;
            display: inline-block;
            .sign-container {
                width: 350px;
            }
            .usname-helper {
                margin-top: 5px;
                font-size: 14px;
                color: grey;
            }
            .form-tittle {
                margin-top: 20px;
            }
            .log-btn {
                margin-top: 30px;
                margin-bottom: 20px;
            }
            .sign-up {
                span:nth-child(2) {
                    color:dodgerblue;
                    margin-left: 9px;
                    cursor: pointer!important;
                }
            }
        }
    }
    .checkbox-container{
      font-size: 13px;
      margin-top: 10px;
    }
</style>
