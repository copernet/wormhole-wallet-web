<template lang="pug">
    div
        q-dialog(v-model="isOpen" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            span(slot="title") {{$t('homePage.myaddress.yourAddress')}}
            span(slot="message") {{pubKeyAddr}}
            div(slot='body')
                q-field(:label="label.pubKey" orientation='vertical')
                    q-input(rows="3" v-model="pubkey" readonly inverted type="textarea")
            template(slot="buttons" slot-scope="props")
                q-btn(flat :label="label.cancel" @click="props.cancel")
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import bch from 'bitcoincashjs'
const { mapState } = createNamespacedHelpers('accountModule')
export default {
  data () {
    return {
      label: {
        pubKey: this.$t('homePage.myaddress.pubkey'),
        cancel: this.$t('common.cancel')
      }
    }
  },
  computed: {
    ...mapState(['account_wallet']),
    pubkey () {
      let self = this
      let addresses = self.account_wallet.addresses || []
      if (self.pubKeyAddr) {
        let index = addresses.findIndex(item => item.address === self.pubKeyAddr)
        return new bch.PrivateKey(addresses[index].privkey).toPublicKey().toString('hex')
      }
      return ''
    }
  },
  props: [ 'isOpen', 'pubKeyAddr' ],
  methods: {
    onHide () {
      this.$emit('pubkHideEmit')
    },
    onCancel () {
      this.$emit('pubkHideEmit')
      this.isOpen = false
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
</style>
