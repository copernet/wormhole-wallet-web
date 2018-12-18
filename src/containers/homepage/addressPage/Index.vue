<template lang="pug">
    div(class='sub-container my-address-body')
        div.title-container
            div.impor-label
                span.welcome-text {{$t('index.welcomeDesc')}}
            div.option-container
                q-btn(icon-right="expand_more"  class='common-btn') {{$t(addressBtnName)}}
                    q-tooltip(anchor="top middle" self="bottom middle" :offset="[10, 10]") {{$t('homePage.myaddress.viewBy')}}
                    q-popover(anchor='bottom left'  self='top left' fit)
                        q-list(link)
                          q-item(v-close-overlay @click.native='addressesClick')
                            q-item-main {{$t('homePage.myaddress.addresses')}}
                          q-item(v-close-overlay @click.native='assetsClick')
                            q-item-main {{$t('homePage.myaddress.assets')}}
                q-btn( icon-right="expand_more" :label="$t('homePage.myaddress.addAddress')"  class='common-btn')
                    q-popover(anchor='bottom left'  self='top left')
                        q-list(link)
                          q-item(v-close-overlay @click.native='createAddressClick')
                            q-item-main {{$t('homePage.myaddress.createNewAddress')}}
                          q-item(v-close-overlay @click.native='importAddressClick')
                            q-item-main {{$t('homePage.myaddress.importAddressWithPri')}}
        div.title-second
            div.wallet-desc
                span.wallet-icon
                span {{$t('account.username')}}: {{account_uuid}}
        div(class='title-third' v-if='addressMainShown') {{this.$t('homePage.myaddress.myAddress')}}
        div(class='title-third' v-if='!addressMainShown') {{this.$t('homePage.myWallet.myAssets.name')}}
        div(class='main-container')
            div(v-for="(listValue,listKey) in  listData" :key="listKey" class='list-container' v-show='addressMainShown')
                q-collapsible(icon-toggle=true)
                    template(slot="header")
                        q-item-main(class='item-main')
                            span(class='item-address') {{listKey}}
                            q-btn(class='qr-back' @click.native='copyClick(listKey)')
                                span.copy-inner
                            q-btn(class='qr-back' @click.native='qrClick(listKey)')
                                span.qr-inner
                        q-item-main(class='item-main flex-between')
                            span(class='item-main-money')
                            q-btn(outline color="primary"  size='xs') {{$t('homePage.myaddress.actions')}}
                                q-popover(anchor='bottom left' self='top left')
                                    q-list(link)
                                        q-item(v-close-overlay @click.native='pubkClick(listKey)') {{$t('homePage.myaddress.pubkey')}}
                                        q-item(v-close-overlay @click.native='signMsgClick(listKey)') {{$t('homePage.myaddress.signMessage')}}
                                        q-item(v-close-overlay @click.native='removeClick(listKey)') {{$t('homePage.myaddress.removeFromWallet')}}
                        q-item-side(right)
                    q-table(:data="listValue" :columns="columns" row-key="name")
            div(v-for="(listValue,listKey) in  listForAssets" :key="listKey" class='list-container' v-show='!addressMainShown')
                q-collapsible(icon-toggle=true)
                    template(slot="header")
                        q-item-main(class='item-main')
                            span(class='item-address') {{listValue.property_name}}
                        q-item-main(class='item-main flex-between')
                            span(class='item-main-money') {{listValue.balance}}
                        q-item-side(right)
                    q-table(:data="listValue.addresses" :columns="assetsColumns" row-key="name")
                        q-tr(slot="header" slot-scope="props")
                            q-th(v-for="col in props.cols" :key="col.name" :props="props" align='left')  {{ col.label }}
                            q-th(auto-width)
                        template(slot="body" slot-scope="props")
                            q-tr(:props="props")
                                q-td(:key="assetsColumns[0].name" :props="props")
                                    span(class="text-italic") {{ props.row.address }}
                                    q-btn(class='qr-back' @click.native='copyClick(props.row.address)')
                                        span.copy-inner
                                    q-btn(class='qr-back' @click.native='qrClick(props.row.address)')
                                        span.qr-inner
                                q-td(:key="assetsColumns[1].name" :props="props")
                                    div {{ props.row.balance_available }}
                                q-td(auto-width)
                                    q-btn(outline color="primary" size='xs') {{$t('homePage.myaddress.actions')}}
                                        q-popover(anchor='bottom left' self='top left')
                                            q-list(link)
                                                q-item(v-close-overlay @click.native='removeClick(props.row.address)') {{$t('homePage.myaddress.removeFromWallet')}}
        qrcode(:isOpen='qrShown' :pubAddress='pubAddress' @qrHideEmit='qrHide')
        pub-key(:isOpen='pubkShown' :pubKeyAddr='pubKeyAddr' @pubkHideEmit='pubkHide')
        sign-msg(:isOpen='signMsgShown' :signMsgAddr='signMsgAddr' @signMsgEmit='signMsgHide')
        remove(:isOpen='removeShown' :removeAddr='removeAddr' @removeEmit='removeHide' @confirmRemove='confirmRemove')
        q-dialog(v-model="importModalShown" stack-buttons prevent-close @cancel="onCancel"  @hide="onHide")
            span(slot="title") {{$t('homePage.myaddress.import.title')}}
            div(slot='body')
                q-field(:label="$t('homePage.myaddress.import.enter')" orientation='vertical' :error-label="$t('homePage.myaddress.import.valid')" :error="errorImportShown")
                    q-input(v-model="privateKeyInput" :float-label="$t('homePage.myaddress.import.keyholder')" inverted)
            template(slot="buttons" slot-scope="props")
                    q-btn(flat :label="$t('homePage.myaddress.addAddress')" @click="addAddress" color="black" :disable='!addAddressEnable' :loading='loadingAdd')
                    q-btn(flat :label="$t('common.cancel')" @click="props.cancel")
</template>
<script>
import popup from '../../../../src/util/notify'
import request from '../../../../src/util/request'
import commonUtil from '../../../../src/util/common'
import Qrcode from './Qrcode'
import PubKey from './PubKey'
import SignMsg from './SignMsg'
import Remove from './Remove'
import addressUtil from '../../../../src/util/address'
import bch from 'bitcore-lib-cash'
import { Big } from 'big.js'
import { mapState, mapActions, mapMutations } from 'vuex'
import { QSpinnerFacebook } from 'quasar'
let { warning, ok } = popup
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default{
  components: { Qrcode, PubKey, SignMsg, Remove },
  data () {
    return {
      label: {
        addressOptions: this.$t('homePage.myaddress.addresses'),
        addAddOptions: this.$t('homePage.myaddress.addAddress'),
        enterPri: this.$t('homePage.myaddress.import.enter'),
        priHolder: this.$t('homePage.myaddress.import.keyholder'),
        cancel: this.$t('common.cancel'),
        addAddress: this.$t('homePage.myaddress.addAddress'),
        valid: this.$t('homePage.myaddress.import.valid')
      },
      columns: [
        {
          name: this.$t('homePage.myaddress.assets'),
          required: true,
          label: this.$t('homePage.myaddress.assets'),
          align: 'left',
          field: 'property_name'
        },
        {
          name: this.$t('homePage.overview.balance'),
          required: true,
          label: this.$t('homePage.overview.balance'),
          align: 'center',
          field: 'balance_available'
        }
      ],
      assetsColumns: [
        {
          name: this.$t('homePage.myaddress.address'),
          required: true,
          label: this.$t('homePage.myaddress.address'),
          align: 'left',
          field: 'address'
        },
        {
          name: this.$t('homePage.overview.balance'),
          required: true,
          label: this.$t('homePage.overview.balance'),
          align: 'center',
          field: 'balance_available'
        }
      ],
      wallId: '',
      pubkeyModelShown: false,
      pubAddress: '',
      qrShown: false,
      pubKeyAddr: '',
      pubkShown: false,
      signMsgShown: false,
      signMsgAddr: '',
      removeShown: false,
      removeAddr: '',
      addressMainShown: true,
      importModalShown: false,
      errorImportShown: false,
      privateKeyInput: '',
      addAddressEnable: false,
      loadingAdd: false,
      addressBtnName: 'homePage.myaddress.addresses'
    }
  },
  activated () {
    this.fetchAssets()
  },
  computed: {
    ...mapState({
      account_wallet: state => state.accountModule.account_wallet,
      account_uuid: state => state.accountModule.account_uuid,
      config_nethasfetched: state => state.configModule.nethasfetched,
      adcount_wallet: state => state.accountModule.account_wallet,
      wallet_bch: state => state.walletModule.bch,
      wallet_whc: state => state.walletModule.whc
    }),
    listData: {
      get: function () {
        return this.transferWhcAndBch(this.$store.state.walletModule.bch, this.$store.state.walletModule.whc)
        // return this.$store.state.walletModule.whc
      },
      set: function (newValue) {
        // this.$store.state.walletModule.whc = newValue
      }
    },
    listForAssets: {
      get: function () {
        return Object.assign(this.transferBchData(this.$store.state.walletModule.bch), this.transferData(this.$store.state.walletModule.whc))
      },
      set: function (newValue) {
      }
    }
  },
  watch: {
    privateKeyInput () {
      let self = this
      if (addressUtil.validate(self.privateKeyInput)) {
        this.errorImportShown = false
        this.addAddressEnable = true
      } else {
        this.errorImportShown = true
        this.addAddressEnable = false
      }
    }
  },
  methods: {
    ...mapMutations(['walletModule/set_wallet_whc', 'walletModule/set_wallet_bch']),
    ...mapActions(['accountModule/account_addAddress', 'accountModule/account_removeAddress']),
    fetchData () {
      let self = this
      let addresses = this.account_wallet.addresses || []
      let address = self.transferAddress(addresses) || []
      let addressStr = commonUtil.generateQsArrayString('address', address)
      request.balance_addresses_details(addressStr).then(resData => {
        if (resData.code === 0) {
          self.listData = resData.result
          self.listForAssets = self.transferData(resData.result)
        } else {
          warning(resData.message, self)
        }
      }).catch(error => {
        warning(error, self)
      })
    },
    transferData (data) {
      var arr = []
      for (let key in data) {
        arr.push(data[key])
      }
      var merged = [].concat.apply([], arr)
      let coinObj = {}
      for (let i = 0; i < merged.length; i++) {
        let propertyId = merged[i].property_id
        let propertyName = merged[i].property_name
        coinObj[propertyId] = coinObj[propertyId] ? Object.assign({}, coinObj[propertyId]) : {}
        coinObj[propertyId].property_name = propertyName
        coinObj[propertyId].addresses = coinObj[propertyId].addresses ? coinObj[propertyId].addresses : []
        coinObj[propertyId].addresses.push(merged[i])
        coinObj[propertyId].balance = coinObj[propertyId].balance ? coinObj[propertyId].balance : 0
        coinObj[propertyId].balance = Big(coinObj[propertyId].balance).plus(merged[i].balance_available).valueOf()
      }
      return coinObj
    },
    transferBchData (data) {
      let bchObj = {}
      bchObj[0] = {} // 0 means bch property id
      bchObj[0].property_name = 'BCH'
      for (let i = 0; i < data.length; i++) {
        bchObj[0].addresses = bchObj[0].addresses ? [].concat.apply([], bchObj[0].addresses) : []
        let item = Object.assign({}, data[i])
        item.balance_available = data[i].confirmed
        bchObj[0].addresses.push(item)
        bchObj[0].balance = bchObj[0].balance ? bchObj[0].balance : 0
        bchObj[0].balance = Big(bchObj[0].balance).plus(data[i].confirmed).valueOf()
      }
      return bchObj
    },
    transferWhcAndBch (bch, whc) {
      let obj = JSON.parse(JSON.stringify(whc))
      for (let i = 0; i < bch.length; i++) {
        let item = {}
        item.address = bch[i].address
        item.property_name = 'BCH'
        item.balance_available = bch[i].confirmed
        obj[bch[i].address].unshift(item)
      }
      return obj
    },
    transferAddress (addresses) {
      let arr = []
      if (Array.isArray) {
        addresses.forEach(element => {
          arr.push(element.address)
        })
      }
      return arr
    },
    addressesClick () {
      this.addressBtnName = 'homePage.myaddress.addresses'
      this.addressMainShown = true
    },
    assetsClick () {
      this.addressBtnName = 'homePage.myaddress.assets'
      this.addressMainShown = false
    },
    createAddressClick () {
      let self = this
      if (!self.config_nethasfetched) {
        warning(self.$t('tips.commonError'), self)
        return
      }
      const CashAddrFormat = bch.Address.CashAddrFormat
      const privateKey = new bch.PrivateKey()
      const address = privateKey.toAddress().toString(CashAddrFormat)
      let params = {
        address: address,
        privKey: privateKey.toWIF()
      }
      self['accountModule/account_addAddress'](params).then(result => {
        ok(self.$t('tips.addSuccess'), self)
        self.fetchData()
      }).catch(error => {
        warning(error, self)
      })
    },
    importAddressClick () {
      this.importModalShown = true
    },
    sendClick () {

    },
    generateQr () {

    },
    qrClick (listKey) {
      this.pubAddress = listKey
      this.qrShown = true
    },
    qrHide () {
      this.qrShown = false
    },
    pubkClick (listKey) {
      this.pubKeyAddr = listKey
      this.pubkShown = true
    },
    pubkHide () {
      this.pubkShown = false
    },
    signMsgClick (listKey) {
      this.signMsgAddr = listKey
      this.signMsgShown = true
    },
    signMsgHide () {
      this.signMsgShown = false
    },
    removeClick (listKey) {
      let addresses = this.account_wallet.addresses || []
      if (addresses.length <= 1) {
        warning(this.$t('homePage.myaddress.cannotremoveTips'), this)
        return
      }
      this.removeAddr = listKey
      this.removeShown = true
    },
    removeHide () {
      this.removeShown = false
    },
    confirmRemove () {
      this.fetchData()
    },
    onCancel () {

    },
    onHide () {

    },
    addAddress () {
      let self = this
      if (!self.config_nethasfetched) {
        self.importModalShown = false
        warning(self.$t('tips.commonError'), self)
        return
      }
      let addr = addressUtil.decodeAddressFromPrivateKey(self.privateKeyInput)
      let params = {
        address: addr,
        privKey: self.privateKeyInput
      }
      self.loadingAdd = true
      self['accountModule/account_addAddress'](params).then(result => {
        ok(self.$t('tips.addSuccess'), self)
        self.loadingAdd = false
        self.importModalShown = false
        self.privateKeyInput = ''
        self.fetchData()
      }).catch(error => {
        self.loadingAdd = false
        warning(error, self)
      })
    },
    fetchAssets () {
      let self = this
      let addresses = self.adcount_wallet.addresses
      let addressArr = commonUtil.transferToAddressArr(addresses)
      let addPostStr = commonUtil.generateQsArrayString('address', addressArr)
      let proArr = []
      proArr.push(request.balance_addresses_details(addPostStr))
      proArr.push(request.getBchBalance(addPostStr))
      self.$q.loading.show(loadingOptions)
      Promise.all(proArr).then(resultArr => {
        self.$q.loading.hide()
        let resultWhc = resultArr[0]
        let resultBch = resultArr[1]
        if (resultWhc.code === 0 && resultBch.code === 0) {
          self['walletModule/set_wallet_whc'](resultWhc.result)
          self['walletModule/set_wallet_bch'](resultBch.result)
        } else {
          warning(self.$t('tips.commonError'))
        }
      })
    },
    copyClick (key) {
      let self = this
      self.$copyText(key).then(function (e) {
        ok(self.$t('common.copied'), self)
      }, function (e) {
      })
    }
  }
}
</script>

<style lang="scss">
    .my-address-body{
        padding: 40px;
        .title-container{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .item{
                flex:1;
                align-items: center;
            }
            .option-container{
              .common-btn{
                margin-left: 30px;
              }
            }
        }
        .list-container{
            margin-top: 30px;
        }
        .small-margin-right{
        margin-right: 5px;
        }
        .item-main{
          display: flex;
          align-items: center;
          flex: 1 1 0;
        }
        .item-main.flex-between{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .qrcode{
            width: 30px;
        }
        .item-address{
            color: #53627c;
            font-size: 17px;
            font-weight: 500;
        }
        .qr-back{
            display: inline-block;
            width: 35px;
            min-width: 35px;
            height: 25px;
            padding: 0 0;
            box-shadow: 0 3px 4px 0 rgba(10, 31, 68, 0.1), 0 0 1px 0 rgba(10, 31, 68, 0.08);
            background-color: #ffffff;
            justify-content: center;
            align-items: center;
            margin-left: 20px;
            .qr-inner{
                display: inline-block;
                width: 15px;
                height: 15px;
                background-image: url('../../../../public/img/qr_icon.png');
                background-size: contain;
            }
            .copy-inner{
                display: inline-block;
                width: 15px;
                height: 15px;
                background-image: url('../../../../public/img/copy_icon.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            &:hover{
              background: rgba(255,255,255,.9)
            }
        }
        .marginLe{
          margin-left: 10px;
        }
        .title-container{
            padding: 0 16px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .item{
                flex:1;
                align-items: center;
            }
            .option-container{
                .common-btn{
                color: #fff;
                font-weight: 500;
                box-sizing: border-box;
                background-image: linear-gradient(257deg, #5ba7ff, #624ae8);
                }
            }
        }
        .title-second{
            padding: 0 16px;
            margin-top: 20px;
            color: #53627c;
            font-size: 16px;
            font-weight: 500;
            .wallet-desc{
              display: flex;
              align-items: center;
            }
            .wallet-icon{
              display: inline-block;
              width:20px;
              height: 16px;
              background-image: url('../../../../public/img/wallet.png');
              background-size: cover;
              margin-right: 10px;
            }
        }
        .title-third{
          padding: 0 16px;
          margin-top: 30px;
          color: #0a1f44;
          font-size: 20px;
          font-weight: 900;
        }
        .impor-label{
          font-weight: 900;
          .welcome-text{
            font-size: 30px;
            font-weight: 600;
            color: #0c66ff;
            font-family: 'PingFangSC'!important;
          }
        }
}

</style>
