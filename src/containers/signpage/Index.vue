<template lang="pug">
    q-layout.sign-body
        q-toolbar.nav-container
            a(href='#/')
                img.wormhole-logo(src="../../../public/img/logo_top.png")
        div.content-container
            div.form-container
                div(class='row form-tittle')
                    div(class='col-10')
                        p {{$t('account.formSignTitle')}}
                    div(class='col-2 text-right sign-up')
                        span or
                        span(@click="login") {{$t('account.login')}}
                div.sign-container
                    q-field(:error="errorEmailShown" :error-label="errorEmailTips")
                        q-input(:float-label="labelEmail" v-model:trim="valueEmail" @blur='eventBlurEmail' @input='eventInputEmail')
                    q-field(:error="errorPassShown" :error-label="errorPassTips")
                        q-input(type="password" :float-label="labelPassword" v-model:trim="valuePassword" @blur='eventBlurPassword' @input='eventInputPassword')
                    q-field(:error="errorConPassShown" :error-label="errorConPassTips")
                        q-input(type="password" :float-label="labelConPassword" v-model:trim="valueConPassword" @blur='eventBlurConPassword' @input='eventInputConPassword')
                    div.rep-container
                        vue-recaptcha(sitekey='6Lfm924UAAAAAFMAeXqpeXdnN2AAH6Wb_c9tbds8' ref="recaptcha" @verify='onVerify' @expired='onExpired' size='100%')
                    q-checkbox(class="choosePrivacy" v-model='ckChecked')
                        span  {{$t('account.signDes')}}
                    span(class='legal' @click='termsClick') {{$t('account.termsOfService')}}
                    span &
                    span(class='legal' @click='disclaimerClick') {{$t('account.disclaimer')}}
                div.row
                    q-btn.log-btn(color="primary" class="full-width" @click="signUp" :disable='btnDisable' :loading='loadingSign') {{this.$t('account.signUp')}}
        q-dialog(v-model="attentionDialogShown" stack-buttons prevent-close class='attention-body')
            div(slot='body')
                div(class='attention-container')
                    div.title {{$t('account.attention.title')}}
                    div.icon-container
                        img.attention-icon(src="../../../public/img/warning_img.png")
                    div(class='impor-text first') {{$t('account.attention.imporTipFirstStage')}}
                        span(class='impor-wallet') 「{{$t('common.walletId')}}」
                        span {{$t('account.attention.imporTipSecondStage')}}
                    div(class='impor-text') {{$t('account.attention.imporTipSecond')}}
                    div(class='impor-desc') {{$t('account.attention.imporDesc')}}
            template( slot="buttons" slot-scope="props")
                div(class='btn-container')
                    q-btn(color="negative" :label="labelIknow"  class='know-btn' @click='konwClick')
</template>

<script>
import QLayout from 'quasar-framework/src/components/layout/QLayout'
import QRadio from 'quasar-framework/src/components/radio/QRadio'
import VueRecaptcha from 'vue-recaptcha'
import addressUtil from '../../../src/util/address'
import commonUtil from '../../../src/util/common'
import popup from '../../../src/util/notify'
import { mapState, mapActions } from 'vuex'
import request from '../../../src/util/request'
import bch from 'bitcoincashjs'
let { warning, ok } = popup

export default {
  components: { QRadio, QLayout, 'vue-recaptcha': VueRecaptcha },
  data () {
    return {
      labelEmail: this.$t('account.email'),
      labelPassword: this.$t('account.password'),
      labelConPassword: this.$t('account.confirmPassword'),
      labelSignDes: this.$t('account.signDes'),
      labelIknow: this.$t('account.attention.iknow'),
      valueEmail: '',
      valuePassword: '',
      valueConPassword: '',
      errorEmailTips: '',
      errorPassTips: '',
      errorConPassTips: '',
      ckChecked: false,
      recaptcha_response: '',
      recaptcha_status: false,
      loadingSign: false,
      isFetchNetSuccess: false,
      attentionDialogShown: false
    }
  },
  created () {
    addressUtil.createAddress()
  },
  computed: {
    ...mapState({
      config_nethasfetched: state => state.configModule.nethasfetched
    }),
    errorEmailShown () {
      return this.errorEmailTips.length > 0
    },
    errorPassShown () {
      return this.errorPassTips.length > 0
    },
    errorConPassShown () {
      return this.errorConPassTips.length > 0
    },
    btnDisable () {
      if (this.valueEmail.length !== 0 &&
       this.valuePassword.length !== 0 &&
       this.valueConPassword.length !== 0 &&
       !this.errorEmailShown &&
       !this.errorPassShown &&
       !this.errorConPassShown &&
       this.recaptcha_status &&
       this.ckChecked) {
        return false
      }
      return true
    }
  },
  watch: {
    valueConPassword () {
      if (this.valueConPassword.length === 0) {
        this.errorConPassTips = this.$t('account.required')
      } else {
        if (this.valueConPassword === this.valuePassword) {
          this.errorConPassTips = ''
        } else {
          this.errorConPassTips = this.$t('account.passNoMath')
        }
      }
    }
  },
  methods: {
    ...mapActions(['accountModule/account_create', 'accountModule/account_addAddress']),
    login () {
      this.$router.push('/login')
    },
    eventBlurEmail () {
      let tip = ''
      if (this.valueEmail.length === 0) {
        tip = this.$t('account.required')
      } else {
        tip = (commonUtil.validateEmail(this.valueEmail) ? '' : this.$t('account.invalidEmail'))
      }
      this.errorEmailTips = tip
    },
    eventInputEmail () {
      if (commonUtil.validateEmail(this.valueEmail)) {
        this.errorEmailTips = ''
      }
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
    onExpired () {
      this.recaptcha_response = ''
      this.recaptcha_status = false
    },
    onVerify (response) {
      this.recaptcha_response = response
      this.recaptcha_status = true
    },
    signReal () {
      var self = this
      var form = {
        valueEmail: self.valueEmail,
        valuePassword: self.valuePassword,
        recaptcha_response_field: self.recaptcha_response
      }
      self['accountModule/account_create'](form)
        .then(resData => {
          if (resData && resData.code === 0) {
            if (self.isFetchNetSuccess) {
              let address = addressUtil.createAddress()
              let params = {}
              params.address = address.hash
              params.privKey = address.privkey
              self['accountModule/account_addAddress'](params).then(() => {
                self.loadingSign = false
                ok(self.$t('tips.registerSuccess'), self)
                self.attentionDialogShown = true
              }).catch(error => {
                self.loadingSign = false
                warning(error, self)
              })
            } else {
              self.loadingSign = false
              ok(self.$t('tips.registerSuccess'), self)
              self.attentionDialogShown = true
            }
          } else {
            self.loadingSign = false
            warning(resData.message, self)
          }
        })
        .catch(error => {
          self.loadingSign = false
          warning(error, self)
        })
    },
    signUp () {
      let self = this
      self.loadingSign = true
      request.get_env().then(resData => {
        if (resData.code === 0) {
          let data = resData.result
          if (typeof (data.testnet) !== 'undefined') {
            self.isFetchNetSuccess = true
            if (data.testnet) {
              bch.Networks.defaultNetwork = bch.Networks.testnet
            } else {
              bch.Networks.defaultNetwork = bch.Networks.mainnet
            }
            self.signReal()
          }
        } else {
          self.loadingSign = false
          warning(resData.message, self)
        }
      }).catch(error => {
        self.loadingSign = false
        warning(error, self)
      })
    },
    konwClick () {
      this.$router.replace('/login')
    },
    onKnowCancel () {
      this.attentionDialogShown = false
    },
    disclaimerClick () {
      this.$router.push('/disclaimer')
    },
    termsClick () {
      this.$router.push('/termofservice')
    }
  }
}
</script>

<style lang="scss">
.sign-body {
  background: #17244f;
  .legal{
    font-size: 14px;
    margin: 0 5px;
    color: rgb(16, 173, 228);
    cursor: pointer;
    vertical-align: bottom;
  }
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
  .nav-container{
      background-color: #17244f!important;
  }
  .form-container {
    background-color: #fff;
    width: 400px;
    padding: 20px;

    .choosePrivacy {
      font-size: 14px;
      margin-top: 15px;
    }
    .sign-container {
      width: 350px;
      .rep-container{
          margin-top: 15px;
      }
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
        color: dodgerblue;
        margin-left: 9px;
        cursor: pointer;
      }
    }
  }
}
.impor-text{
  text-align: center;
  color: #0a1f44;
  font-size: 24px;
  font-weight: 500;
  &.first{
    margin-top: 60px;
  }
}
.impor-desc{
  width: 660px;
  font-size: 16px;
  color: #53627c;
  text-align: center;
  margin-top: 24px;
}
.btn-container{
  width: 100%;
  text-align: center;
}
.know-btn{
  min-width: 400px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}
.attention-body{
  .attention-container{
    padding-top: 32px;
    .title{
      text-align: center;
      font-size: 30px;
      font-weight: 500;
      color: #f03d3d;
    }
    .icon-container{
      text-align: center;
      margin-top: 50px;
      .attention-icon{
        width: 180px;
      }
    }
    .impor-wallet{
      color: #0c66ff;
      font-size: 24px;
      font-weight: 500;
    }
  }
  .modal.minimized .modal-content{
    max-height: initial;
  }
 .modal-scroll{
    max-height: initial;
  }
}

</style>
