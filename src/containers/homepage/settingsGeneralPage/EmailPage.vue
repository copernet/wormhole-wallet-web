<template lang="pug">
    q-dialog(
    v-model="isOPen"
    prevent-close)
        span(slot="title") {{$t('homePage.accountSetting.changeEmail')}}
         q-icon(name="close" class="absolute-right" @click.native="cancel" style="cursor: pointer; display: inline-block")
        div(slot="body")
            q-field(:error="errorEmailShown" :error-label="errorEmailTips")
                q-input(:float-label="labelEmail" v-model:trim="valueEmail" @blur='eventBlurEmail' @input='eventInputEmail')
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
import popup from '../../../../src/util/notify'
let { warning, ok } = popup
const { mapActions, mapMutations, mapState } = createNamespacedHelpers('accountModule')
export default {
  components: { QIcon },
  data () {
    return {
      loadingChange: false,
      errorEmailTips: '',
      labelEmail: this.$t('common.email'),
      valueEmail: ''
    }
  },
  computed: {
    ...mapState(['account_wallet', 'account_uuid']),
    errorEmailShown () {
      return this.errorEmailTips.length > 0
    },
    btnDisable () {
      if (this.valueEmail.length !== 0 && !this.errorEmailShown) {
        return false
      }
      return true
    }
  },
  props: [ 'isOPen' ],
  methods: {
    ...mapMutations(['set_account_wallet']),
    ...mapActions(['account_saveSession']),
    eventInputEmail () {
      this.valiEmail()
    },
    eventBlurEmail () {
      this.valiEmail()
    },
    valiEmail () {
      let tip = ''
      if (this.valueEmail.length === 0) {
        tip = this.$t('account.required')
      } else {
        tip = (commonUtil.validateEmail(this.valueEmail) ? '' : this.$t('account.invalidEmail'))
      }
      this.errorEmailTips = tip
    },
    change () {
      var self = this
      self.loadingChange = true
      let wallet = self.account_wallet || {}
      wallet.email = self.valueEmail
      self.set_account_wallet(wallet)
      self.account_saveSession().then(resData => {
        self.valueEmail = ''
        self.loadingChange = false
        if (resData && resData.code === 0) {
          ok(self.$t('tips.updateSuccess'), self)
          self.$emit('emailCancelEmit')
        } else {
          warning(resData.message, self)
        }
      }).catch(error => {
        self.loadingChange = false
        warning(error, self)
      })
    },
    cancel () {
      this.$emit('emailCancelEmit')
      this.valueEmail = ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
