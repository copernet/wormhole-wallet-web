<template lang="pug">
    div()
        q-modal(v-model='isOPen' prevent-close @hide="onHide" @cancel="onCancel" class='mfa-body')
            q-modal-layout
                //- q-toolbar(slot='header')
                //-     q-toolbar-title(v-if='enableSetup') {{$t('homePage.accountSetting.mfa.setupTitle')}}
                //-     q-toolbar-title(v-if='!enableSetup') {{$t('homePage.accountSetting.mfa.disableTitle')}}
                div(class='layout-padding')
                    div(v-if='enableSetup')
                        div(class='titlea')
                            div(v-if='enableSetup') {{$t('homePage.accountSetting.mfa.setupTitle')}}
                            div(v-if='!enableSetup') {{$t('homePage.accountSetting.mfa.disableTitle')}}
                        div(class='qr-container')
                            img(:src='imgSrc')
                        div(class='tokenS-container')
                            span.label-desc {{$t('homePage.accountSetting.mfa.yourtokenS')}} :
                            span(class='bold-text') {{secret}}
                        div(class='tokenS-desc-container')  {{$t('homePage.accountSetting.mfa.storeDesc')}}
                        div(class='tokenS-desc-container')  {{$t('homePage.accountSetting.mfa.entercurr')}}
                        q-field(:error="errorQueShown" :error-label="label.required" orientation='vertical')
                            q-input(:float-label="label.perQue" v-model:trim="perQueInput")
                        q-field(:error="errorAnsShown" :error-label="label.required" orientation='vertical')
                            q-input(:float-label="label.perAns" v-model:trim="perAnsInput")
                        q-field(:error="errorMfaShown" :error-label="label.required" orientation='vertical' class='mfa-container')
                            q-input(:float-label="label.mfacode" v-model:trim="mfaInput")
                    div(v-if='!enableSetup')
                        div  {{$t('homePage.accountSetting.mfa.disableDesc')}}
                        q-field(:error="errorDisableShown" orientation='vertical')
                            q-input(v-model:trim="disableInput")
                        q-field(:error="errorDisableMfaShown" :error-label="label.required" orientation='vertical')
                            q-input(:float-label="label.mfacode" v-model:trim="disableMfaInput")
                    div(class='save-btn-container')
                        q-btn(@click='submita' :disable='!validateBtnEnable' class='save-btn') {{this.$t('common.save')}}

</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import request from '../../../../src/util/request'
import popup from '../../../../src/util/notify'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers('accountModule')

let { warning, ok } = popup
export default {
  data () {
    return {
      label: {
        cancel: this.$t('common.cancel'),
        submit: this.$t('common.submit'),
        perQue: this.$t('homePage.accountSetting.mfa.personalQue'),
        perAns: this.$t('homePage.accountSetting.mfa.personalAns'),
        mfacode: this.$t('homePage.accountSetting.mfa.mfacode'),
        required: this.$t('account.required')
      },
      backNameInput: '',
      valuePassword: '',
      exportedArr: [],
      secret: '',
      perQueInput: '',
      perAnsInput: '',
      mfaInput: '',
      test: true,
      disableInput: '',
      disableMfaInput: '',
      prov: '',
      loadingSubmit: false
    }
  },
  computed: {
    ...mapState(['account_mfa', 'account_asq', 'account_uuid']),
    enableSetup () {
      return !this.account_mfa
    },
    errorQueShown () {
      return !(this.perQueInput.length > 0)
    },
    errorAnsShown () {
      return !(this.perAnsInput.length > 0)
    },
    errorMfaShown () {
      return !(this.mfaInput.length > 0)
    },
    errorDisableMfaShown () {
      return !(this.disableMfaInput.length > 0)
    },
    validateBtnEnable () {
      let self = this
      if (self.enableSetup) {
        return !this.errorQueShown && !this.errorAnsShown && !this.errorMfaShown
      } else {
        return !this.errorDisableShown && !this.errorDisableMfaShown
      }
    },
    errorDisableShown () {
      if (this.disableInput === 'DISABLE') {
        return false
      }
      return true
    },
    imgSrc () {
      return 'https://chart.googleapis.com/chart?chs=160x160&cht=qr&=UTF-8&chl=' + this.prov
    }
  },
  props: [ 'isOPen' ],
  activated () {
    let self = this
    if (!self.account_mfa) {
      let params = {
        uuid: self.account_uuid
      }
      request.new_mfa(params).then(resData => {
        if (resData.code === 0) {
          let data = resData.result
          self.secret = data.secret
          self.prov = data.prov
        } else {
          self.secret = ''
          self.prov = ''
        //   warning(resData.message, self)
        }
      }).catch(() => {
        self.secret = ''
        self.prov = ''
        // warning(error, self)
      })
    }
  },
  methods: {
    ...mapMutations(['set_account_mfa']),
    ...mapActions(['account_updateMFA']),
    onHide () {
      this.$emit('mfasetupCancelEmit')
      this.perQueInput = ''
      this.perAnsInput = ''
      this.disableInput = ''
      this.mfaInput = ''
      this.disableMfaInput = ''
    },
    onCancel () {
      this.$emit('mfasetupCancelEmit')
      this.perQueInput = ''
      this.perAnsInput = ''
      this.disableInput = ''
      this.mfaInput = ''
      this.disableMfaInput = ''
    },
    submita () {
      let self = this
      let params = {}
      if (self.enableSetup) {
        params.secret = self.secret
        params.token = self.mfaInput
        params.action = 'add'
        params.asq = self.perQueInput
        params.asa = self.perAnsInput
      } else {
        params.token = self.disableMfaInput
        params.action = 'del'
      }
      self.loadingSubmit = true
      self.account_updateMFA(params).then(result => {
        self.loadingSubmit = false
        if (result.code === 0) {
          self.set_account_mfa(!self.account_mfa)
          ok(self.$t('tips.updateSuccess'), self)
          self.$emit('mfasetupCancelEmit')
        } else {
          warning(result.message, self)
        }
      }).catch(error => {
        self.loadingSubmit = false
        warning(error, self)
      })
    }
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
.mfa-body{
  .modal-content{
    max-height: 90vh;
  }
  .titlea{
    font-size: 30px;
    color: #0c66ff;
    font-weight: 900;
    text-align: center;
  }
  .mfa-container{
  }
  .qr-container{
    text-align: center;
    margin-top: 20px;
    img{
      width: 170px;
      height: 170px;
      border: 1px solid #0c66ff;
    }
  }
  .tokenS-container{
    font-size: 20px;
    text-align: center;
    font-weight: 900;
    margin-top: 20px;
    margin-bottom: 20px;
    .label-desc{
      color: #0c66ff;
    }
  }
  .tokenS-desc-container{
    font-size: 14px;
    color: #53627c;
    line-height: 1.5;
  }
  .bold-text{
    font-weight: 900;
  }
  .q-layout-footer .q-toolbar{
    padding: 0px;
  }
  .save-btn{
    background-color: #0c66ff;
    color: #fff;
    width: 300px;
  }
  .save-btn-container{
    margin-top: 40px;
    text-align: center;
  }
}
</style>
