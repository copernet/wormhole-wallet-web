<template lang="pug">
    q-item(:to="list[0].addr" @click.native="toogleSide(sideType.name)" class='q-item-custom'  v-close-overlay highlight=false)
        q-item-side
        q-item-main.list-main() {{$t(sideType.name)}}
            q-icon.title-icon(:name="sideType.icon")
            div(v-if="type === sideType.name" v-for=" l in  list" :key="l.name")
                q-item(:to="l.addr" @click.native="toogleSide('stopToogle')")
                    q-item-main(:label="$t(l.name)")
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations, mapState } = createNamespacedHelpers('homeModule')
export default {
  data () {
    return {
      list: []
    }
  },
  props: ['sideType'],
  computed: {
    ...mapState({
      type: 'sideType'
    })
  },
  methods: {
    ...mapMutations(['toogleSide']),
    getData () {
      let { name } = this.sideType
      var arr
      switch (name) {
        case 'homePage.menu.myaddress':
          arr = [
            'homePage.myWallet.walletOverview',
            'homePage.myWallet.walletAddresses',
            'homePage.myWallet.walletAssets',
            'homePage.myWallet.walletHistory',
            'homePage.myWallet.walletSend'
          ]
          break
        case 'homePage.menu.explorer':
          arr = [
            // 'homePage.explorer.transactions.exTransactions',
            'homePage.explorer.assets.exAssets',
            'homePage.explorer.activeCrowdSales.exCrowdSales'
          ]
          break
        case 'homePage.menu.setting':
          arr = [
            'homePage.accountSetting.settingGeneral'
          ]
          break
        default:
          break
      }
      arr.forEach((item) => {
        let content = {}
        let index = item.lastIndexOf('.')
        content.name = item
        content.addr = item.substring(index + 1)
        this.list.push(content)
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.list-main {
    position: relative;
    .title-icon {
        position: absolute;
        top: 0;
        left: -25px;
        font-size: 20px;
    }
}
.q-item-custom{
    padding-left: 0px;
    color: rgb(117, 118, 121);
    font-size: 16px;
    font-weight: 900;
}
</style>
