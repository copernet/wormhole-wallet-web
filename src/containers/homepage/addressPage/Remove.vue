<template lang="pug">
    div
        q-dialog(v-model="isOpen" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            div(slot='title') {{$t('homePage.myaddress.removeDesc')}}
            div(slot="message")
                div(class='addressBtn') Address: {{removeAddr}}
            div(slot='body')
                div(class='center-d') {{$t('homePage.myaddress.areyousure')}}?
                div(class='details') {{$t('homePage.myaddress.removeDescDetails')}}
                q-alert(type='negative' class='q-mb-sm' class='nealert') {{$t('homePage.myaddress.removeTips')}}
            template(slot="buttons" slot-scope="props")
                    q-btn(flat :label="label.yesremove" @click="remove" color='negative')
                    q-btn(flat :label="label.cancel" @click="props.cancel")
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import popup from '../../../../src/util/notify'
const { mapActions } = createNamespacedHelpers('accountModule')
let { warning } = popup

export default {
  data () {
    return {
      label: {
        cancel: this.$t('common.cancel'),
        yesremove: this.$t('homePage.myaddress.yesremove')
      }
    }
  },
  computed: {
  },
  props: [ 'isOpen', 'removeAddr' ],
  methods: {
    ...mapActions(['account_removeAddress']),
    onHide () {
      this.$emit('removeEmit')
    },
    onCancel () {
      this.$emit('removeEmit')
      this.isOpen = false
    },
    remove () {
      let self = this
      self.account_removeAddress(self.removeAddr).then(result => {
        this.$emit('removeEmit')
        this.$emit('confirmRemove')
      }).catch(error => {
        warning(error, self)
      })
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
.center-d{
  text-align: center;
  font-size: 18px;
}
.details{
  max-width: 600px;
  text-align: justify;
  line-height: 20px;
}
.nealert{
  margin-top:10px;
}
</style>
