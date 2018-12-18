<template lang="pug">
    div.sub-container
        div.sub-item
            div.sub-half-container.item
                div.title-container
                    span.title-text {{$t('common.walletId')}}
                div.description
                    span {{$t('homePage.accountSetting.walletIdDesc')}}
                    span.warn-text {{$t('homePage.accountSetting.walletIdWarn')}}
            div.sub-half-container.right
                div.weight-text {{account_uuid}}
        div.sub-item
            div.sub-half-container.item
                div.title-container
                    span.title-text {{$t('homePage.accountSetting.passwordText')}}
                div.description {{$t('homePage.accountSetting.passwordDesc')}}
            div.sub-half-container.right
                div.pass-main(v-show='passMainShown')
                    q-btn(color="tertiary" class='right-btn' @click='passChange' no-caps) {{this.$t('common.change')}}
        div.sub-item
            div.sub-half-container.item
                div.title-container
                    span.title-text {{$t('homePage.accountSetting.emailChange')}}
                div.description {{$t('homePage.accountSetting.emailDesc')}}
            div.sub-half-container.right
                //- div.pass-main(v-if='emailMainShown')
                //-     q-btn(color="tertiary" class='right-btn' @click='emailChange' no-caps) {{this.$t('common.change')}}
                //- div.email-change(v-if='!emailMainShown')
                //-     q-field(:error="errorEmailShown" :error-label="errorEmailTips")
                //-         q-input(:float-label="labelEmail" v-model:trim="valueEmail" @blur='eventBlurEmail' @input='eventInputEmail')
                //-     div.btn-container
                //-         q-btn.btn(color="light" @click='emailCancel' no-caps) {{this.$t('common.cancel')}}
                //-         q-btn.btn(color="tertiary" @click='emailSave' :disable='emailClickEnable' :loading='loadingSave' no-caps) {{this.$t('common.save')}}
                div.pass-main()
                    q-btn(color="tertiary" class='right-btn' @click='emailChange' no-caps) {{this.$t('common.change')}}
        div.sub-item
            div.sub-half-container.item
                div.title-container
                    span.title-text {{$t('homePage.accountSetting.mfa.title')}}
                div.description {{$t('homePage.accountSetting.mfa.desc')}}
                div.download-container
                    a(target='_blank' href='https://itunes.apple.com/us/app/authy/id494168017')
                        img(src="../../../../public/img/app-store-badge.svg")
                    a(target='_blank' href='https://play.google.com/store/apps/details?id=com.authy.authy')
                        img(src="../../../../public/img/google-play-badge.png")
            div.sub-half-container.right
                div.pass-main(v-show='passMainShown')
                    q-btn(color="tertiary" class='right-btn' @click='setup' no-caps) {{this.$t('common.setup')}}
        login-page(:isOPen="dialogLoginStatus" @loginCancel="cancelLoginDialog" @loginOpen="openLoginDialog" @openChangeAtLogin="openChangeDialogAtLogin" :loginType='changePassType')
        login-page(:isOPen="dialogLoginSetupStatus" @loginCancel="cancelLoginDialog" @loginOpen="openLoginDialog"  @openSetupAtLoginEmit='openSetupAtLogin' :loginType='setupMfaType')
        login-page(:isOPen="dialogEmailStatus" @loginCancel="cancelLoginDialog" @loginOpen="openLoginDialog"  @openEmailAtLoginEmit='openEmailAtLogin' :loginType='emailType')
        change-page(:isOPen="dialogChangeStatus" @changeCancel="cancelChangeDialog" @changeOpen="openChangeDialog")
        mfa-setup(:isOPen='dialogSetupStatus' @mfasetupCancelEmit='mfasetupCancel')
        email(:isOPen='dialogEmailContainerStatus' @emailCancelEmit='emailCancel')
</template>

<script>
// import commonUtil from '../../../../src/util/common'
import { createNamespacedHelpers } from 'vuex'
import LoginPage from './LoginFormPage'
import ChangePage from './ChangePage'
import MfaSetup from './MfaSetup'
import Email from './EmailPage'
// import popup from '../../../../src/util/notify'
const { mapActions, mapMutations, mapState } = createNamespacedHelpers('accountModule')
// let { warning, ok } = popup
export default {
  components: { LoginPage, ChangePage, MfaSetup, Email },
  data () {
    return {
      passMainShown: true,
      errorCurrPassShown: false,
      errorCurrPassTips: '',
      labelCurrPass: this.$t('homePage.accountSetting.currentPassword'),
      valueCurrPass: '',
      errorNewPassShown: false,
      errorNewPassTips: '',
      labelNewPass: this.$t('homePage.accountSetting.newPassword'),
      valueNewPass: '',
      errorConfPassShown: false,
      errorConfPassTips: '',
      labelConfPass: this.$t('homePage.accountSetting.confirmPassword'),
      valueConfPass: '',
      errorEmailTips: '',
      labelEmail: this.$t('common.email'),
      valueEmail: '',
      dialogLoginStatus: false,
      dialogChangeStatus: false,
      dialogLoginSetupStatus: false,
      changePassType: 'CHANGEPASS',
      setupMfaType: 'SETUPMFA',
      emailType: 'EMAILFORLOGIN',
      dialogSetupStatus: false,
      loadingSave: false,
      dialogEmailStatus: false,
      dialogEmailContainerStatus: false
    }
  },
  computed: {
    ...mapState(['account_wallet', 'account_uuid']),
    errorEmailShown () {
      return this.errorEmailTips.length > 0
    },
    emailClickEnable () {
      if (this.valueEmail.length !== 0 && !this.errorEmailShown) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapMutations(['set_account_wallet', 'set_account_wallet_email']),
    ...mapActions(['account_saveSession']),
    passCancel () {
      this.passMainShown = true
    },
    passSave () {

    },
    passChange () {
      this.dialogLoginStatus = true
    },
    emailChange () {
      this.dialogEmailStatus = true
    },
    emailCancel () {
      this.dialogEmailContainerStatus = false
    },
    cancelLoginDialog () {
      this.dialogLoginStatus = false
      this.dialogLoginSetupStatus = false
      this.dialogEmailStatus = false
    },
    cancelChangeDialog () {
      this.dialogChangeStatus = false
    },
    openLoginDialog () {
      this.dialogLoginStatus = true
    },
    openChangeDialog () {
      this.dialogChangeStatus = true
    },
    openChangeDialogAtLogin () {
      this.dialogChangeStatus = true
    },
    openSetupAtLogin () {
      this.dialogSetupStatus = true
    },
    openEmailAtLogin () {
      this.dialogEmailContainerStatus = true
    },
    setup () {
      this.dialogLoginSetupStatus = true
    },
    mfasetupCancel () {
      this.dialogSetupStatus = false
    }

  }
}
</script>

<style lang="scss" scoped>
    .sub-container{
        padding: 40px;
        .sub-item{
            padding: 20px 0;
            border-bottom: 1px solid rgb(204, 204, 204);
            display: flex;
            .sub-half-container{
                flex:1;
                .title-container{
                    .title-text{
                      color: black;
                      font-size: 15px;
                      font-weight: 900;
                    }
                }
                .description{
                        font-size: 13px;
                        padding-top: 10px;
                }
                .right-btn{
                    justify-content: flex-end;
                }
                .pass-change{
                    width: 60%;
                    .btn-container{
                        display: flex;
                        margin-top: 5px;
                        .btn{
                            flex: 1;
                            margin: 5px;
                        }
                    }
                }
                .email-change{
                    width: 60%;
                     .btn-container{
                        display: flex;
                        margin-top: 5px;
                        .btn{
                            flex: 1;
                            margin: 5px;
                        }
                    }
                }
            }
            .sub-half-container.right{
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
            }
        }
    }
    .warn-text{
      color: red;
    }
    .weight-text{
      font-weight: 900;
    }
    .download-container{
      margin-top: 10px;
    }
    .download-container img{
      height: 40px;
      margin-right: 5px;
    }
</style>
