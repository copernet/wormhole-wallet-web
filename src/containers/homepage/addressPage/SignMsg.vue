<template lang="pug">
    div
        q-dialog(v-model="isOpen" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            span(slot="title") {{$t('homePage.myaddress.signMessage')}}
            div(slot="message")
                span {{$t('homePage.myaddress.signMsgDesc')}}
                div(class='addressBtn') {{signMsgAddr}}
            div(slot='body')
                //- div {{$t('homePage.myaddress.signingAddress')}} :
                q-field(:label="label.signMsgYourWant" orientation='vertical' )
                    q-input(rows="3" v-model:trim="pubkeyInput"  inverted type="textarea")
                //- q-btn(outline color="primary" label="Outline" class='signbtn')
                q-field(:label="label.signedMsg" orientation='vertical')
                    q-input(rows="3" v-model="pubkeyShow" readonly inverted-light color="amber" type="textarea")
            template(slot="buttons" slot-scope="props")
                    //- q-btn(flat :label="label.sign" @click.native="sign" color='black' :disable='btnDisable')
                    q-btn(flat :label="label.cancel" @click="props.cancel")
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import addressUtil from '../../../../src/util/address'
const { mapState } = createNamespacedHelpers('accountModule')
export default {
  data () {
    return {
      label: {
        signMsgYourWant: this.$t('homePage.myaddress.signMsgYourWant'),
        signedMsg: this.$t('homePage.myaddress.signedMsg'),
        cancel: this.$t('common.cancel'),
        sign: this.$t('homePage.myaddress.sign')
      },
      pubkeyInput: ''
    }
  },
  computed: {
    ...mapState(['account_wallet']),
    btnDisable () {
      return this.errorPubkeyShown
    },
    pubkeyShow () {
      if (this.pubkeyInput.length === 0) {
        return ''
      } else {
        return this.getSignMsg()
      }
    }
  },
  props: [ 'isOpen', 'signMsgAddr' ],
  methods: {
    onHide () {
      this.$emit('signMsgEmit')
    },
    onCancel () {
      this.pubkeyInput = ''
      this.$emit('signMsgEmit')
      this.isOpen = false
    },
    getSignMsg () {
      let self = this
      let addresses = self.account_wallet.addresses || []
      let index = addresses.findIndex(item => item.address === self.signMsgAddr)
      return addressUtil.signMsg(self.pubkeyInput, addresses[index].privkey)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.signbtn{
    margin: 5px 0;
}
.addressBtn{
    color: black;
    font-weight: 900;
}
</style>
