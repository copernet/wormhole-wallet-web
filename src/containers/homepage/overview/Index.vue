<template lang="pug">
    div(class='sub-container overview-body')
        div.title-container
            div.impor-label
                //- span  {{$t('account.username')}}:
                //- span(class='small-margin-right')  {{account_uuid}}
                span.welcome-text {{$t('index.welcomeDesc')}}
            div.option-container
                q-btn(icon-right="expand_more"  class='common-btn') {{$t('homePage.overview.walletOptions')}}
                    q-popover(anchor='bottom left'  self='top left' fit)
                        q-list(link)
                          q-item(v-close-overlay @click.native='backupClick')
                            q-item-main {{$t('homePage.overview.backup')}}
                          q-item(v-close-overlay @click.native='importClick')
                            q-item-main {{$t('homePage.overview.import')}}
        div.title-second
            div.wallet-desc
                span.wallet-icon
                span {{$t('account.username')}}: {{account_uuid}}
        div.card-container
            div.item
                div.title {{$t('index.whatiswhcwallet.title')}}
                div.desc  {{$t('index.whatiswhcwallet.desc')}}
                div.btn-container
            div.item
                div.title {{$t('index.howshouldget.title')}}
                div.desc  {{$t('index.howshouldget.desc')}}
                div.btn-container
                    q-btn(:label="$t('homePage.myWallet.myAssets.title')" outline color="primary" no-caps @click='createWhc')
        q-collapsible(class='coll-title-container' disable)
                template(slot="header")
                    q-item-main(class='item-main') {{$t('common.assetsName')}}
                    q-item-main(class='item-main') {{$t('common.amount')}}
                    q-item-side(right class='arrow')
        div(v-for="listItem in  bchListData" :key="listItem.name" class='list-container')
            q-collapsible
                template(slot="header")
                    q-item-main(class='item-main') {{listItem.property_name}}
                    q-item-main(class='item-main') {{listItem.balance}}
                    q-item-side(right)
                q-table(:data="listItem.addresses" :columns="bchColumns" row-key="name")
                    q-tr(slot="header" slot-scope="props")
                        q-th(align='left') {{$t('homePage.overview.address')}}
                        q-th(align='right')
                        q-th(align='left' class='td-right') {{$t('homePage.overview.balance')}}
                    template(slot="body" slot-scope="props")
                        q-tr(:props="props")
                            q-td(:key="bchColumns[0].name" :props="props")
                                span(class="text-italic") {{ props.row.address }}
                            q-td(:key="bchColumns[1].name" :props="props" class='center-td')
                                span(v-if='props.row.unconfirmed!=0').unconfirmed {{$t('homePage.overview.unconfirmed')}}
                                span(class="table-number" v-if='props.row.unconfirmed!=0') {{ props.row.unconfirmed }}
                                span.confirmed {{$t('homePage.overview.confirmed')}}
                            q-td(:key="bchColumns[2].name" :props="props" class='td-right')
                                span(class="table-number") {{ props.row.confirmed }}
        div(v-for="listItem in  whcListData" :key="listItem.name" class='list-container')
            q-collapsible
                template(slot="header")
                    q-item-main(class='item-main') {{listItem.property_name}}
                    q-item-main(class='item-main') {{listItem.balance}}
                    q-item-side(right)
                q-table(:data="listItem.addresses" :columns="whcColumns" row-key="name")
                    q-tr(slot="header" slot-scope="props")
                        q-th(align='left') {{$t('homePage.overview.balance')}}
                        q-th(align='right')
                        q-th(align='right')
                        q-th(align='left' class='td-right') {{$t('homePage.overview.address')}}
                    template(slot="body" slot-scope="props")
                        q-tr(:props="props")
                            q-td(:key="whcColumns[0].name" :props="props")
                                span(class="text-italic") {{ props.row.address }}
                            q-td
                            q-td(:key="whcColumns[1].name" :props="props" class='center-td')
                                div
                                    span(v-if='props.row.pendingneg!=0||props.row.pendingpos!=0' class='unconfirmed') {{$t('homePage.overview.unconfirmed')}}
                                    span(v-if='props.row.pendingneg!=0').send-arrow
                                    span(class="table-number" v-if='props.row.pendingneg!=0') {{ props.row.pendingneg }}
                                    span(v-if='props.row.pendingpos!=0').receive-arrow
                                    span(class="table-number" v-if='props.row.pendingpos!=0') {{ props.row.pendingpos }}
                                    span.confirmed {{$t('homePage.overview.confirmed')}}
                            q-td(:key="whcColumns[3].name" :props="props" class='td-right')
                                span(class="table-number") {{ props.row.balance_available }}
        back-up(:isOpen='backupShown'  @backupEmit='backupHide' @backStatusObjEmit='backStatusObj')
        import-page(:isOpen='importShown'  @importHideEmit='importHide' @importHandleObjEmit='importHandleObj')
        q-dialog(stack-buttons prevent-close v-model='dialogShown' @ok='backupOkClick')
            span(slot='title') {{$t('homePage.overview.export.title')}}
            div(slot='body')
                q-list
                    q-item(v-for="item in statusObj"  :key="item.address")
                        q-item-side(:icon="item.icon" :color="item.color" inverted)
                        q-item-main
                            q-item-tile(color='black') {{item.address}}
                            q-item-tile() {{item.message}}
        q-dialog(stack-buttons prevent-close v-model='dialogImportShown' @ok='importOkClick')
            span(slot='title') {{$t('homePage.overview.importSection.title')}}
            div(slot='body')
                q-list
                    q-item(v-for="item in importStatusObj"  :key="item.address")
                        q-item-side(:icon="item.icon" :color="item.color" inverted)
                        q-item-main
                            q-item-tile(label color='black') {{item.address}}
                            q-item-tile(sublabel) {{item.message}}
</template>
<script>
// import popup from '../../../../src/util/notify'
// import request from '../../../../src/util/request'
import commonUtil from '../../../../src/util/common'
import BackUp from './BackUp'
import ImportPage from './ImportPage'
// const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
import { Big } from 'big.js'
import request from '../../../util/request'
import { mapState, mapActions, mapMutations } from 'vuex'
import { QSpinnerFacebook } from 'quasar'
import popup from '../../../../src/util/notify'
let { warning } = popup
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default{
  components: { BackUp, ImportPage },
  data () {
    return {
      label: {
      },
      whcColumns: [
        {
          name: this.$t('homePage.overview.address'),
          required: true,
          label: this.$t('homePage.overview.address'),
          align: 'left',
          field: 'address'
        },
        {
          name: this.$t('homePage.overview.unconfirmed'),
          required: false,
          label: this.$t('homePage.overview.unconfirmed'),
          align: 'right',
          field: 'pendingpos'
        },
        {
          name: this.$t('homePage.overview.unconfirmed'),
          required: false,
          label: this.$t('homePage.overview.unconfirmed'),
          align: 'right',
          field: 'pendingneg'
        }, {
          name: this.$t('homePage.overview.balance'),
          required: true,
          label: this.$t('homePage.overview.balance'),
          align: 'left',
          field: 'balance_available'
        }
      ],
      bchColumns: [
        {
          name: this.$t('homePage.overview.address'),
          required: true,
          label: this.$t('homePage.overview.address'),
          align: 'left',
          field: 'address'
        },
        {
          name: this.$t('homePage.overview.unconfirmed'),
          required: false,
          label: this.$t('homePage.overview.unconfirmed'),
          align: 'right',
          field: 'unconfirmed'
        },
        {
          name: this.$t('homePage.overview.balance'),
          required: true,
          label: this.$t('homePage.overview.balance'),
          align: 'left',
          field: 'confirmed'
        }

      ],
      wallId: '',
      backupShown: false,
      dialogShown: false,
      statusObj: [],
      importShown: false,
      importStatusObj: [],
      dialogImportShown: false
    }
  },
  activated () {
    this.fetchAssets()
  },
  computed: {
    ...mapState({
      account_wallet: state => state.accountModule.account_wallet,
      account_uuid: state => state.accountModule.account_uuid,
      adcount_wallet: state => state.accountModule.account_wallet,
      wallet_bch: state => state.walletModule.bch,
      wallet_whc: state => state.walletModule.whc
    }),
    // listData: {
    //   get: function () {
    //     return Object.assign(this.transferBchData(this.wallet_bch), this.transferData(this.wallet_whc))
    //   },
    //   set: function (newValue) {

    //   }
    // },
    bchListData: {
      get: function () {
        return this.transferBchData(this.wallet_bch)
      },
      set: function (newValue) {

      }
    },
    whcListData: {
      get: function () {
        return this.transferData(this.wallet_whc)
      },
      set: function (newValue) {

      }
    }
  },
  methods: {
    ...mapMutations(['walletModule/set_wallet_whc', 'walletModule/set_wallet_bch']),
    ...mapActions(['accountModule/account_addAddress']),
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
    backupClick () {
      this.backupShown = true
    },
    importClick () {
      this.importShown = true
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
    backupHide () {
      this.backupShown = false
    },
    backStatusObj (statusObj) {
      this.statusObj = statusObj
      this.backupShown = false
      this.dialogShown = true
    },
    importHide () {
      this.importShown = false
    },
    importHandleObj (obj) {
      let self = this
      self.importStatusObj = obj.statusObjImport
      self.validated = obj.validated
      self.dialogImportShown = true
      self.$q.loading.hide()
    },
    handleImportData (wallet) {
      let self = this
      if (wallet) {
        let total = wallet.addresses.length
        let completed = 0
        var next = function () {
          return importAddress(wallet.addresses[completed])
        }
        var importAddress = function (addr) {
          let item = {}
          if (completed === total) {
            self.dialogImportShown = true
            self.$q.loading.hide()
            return
          }
          if (addr.privkey) {
            let params = {
              address: addr.address,
              privKey: addr.privkey
            }
            self['accountModule/account_addAddress'](params).then(() => {
              item.message = self.$t('homePage.overview.importSection.imported')
              item.status = 'success'
              item.address = addr.address
              item.icon = 'done'
              item.color = 'primary'
              self.importStatusObj.push(item)
              completed++
              return next()
            })
          } else if (addr.pubkey) {
            let params = {
              address: addr.address,
              privKey: undefined,
              pubKey: addr.pubkey
            }
            self['accountModule/account_addAddress'](params).then(() => {
              item.message = self.$t('homePage.overview.importSection.imported')
              item.status = 'success'
              item.address = addr.address
              item.icon = 'done'
              item.color = 'primary'
              self.importStatusObj.push(item)
              completed++
              return next()
            })
          } else {
            let params = {
              address: addr.address
            }
            self['accountModule/account_addAddress'](params).then(() => {
              item.message = self.$t('homePage.overview.importSection.imported')
              item.status = 'success'
              item.address = addr.address
              item.icon = 'done'
              item.color = 'primary'
              self.importStatusObj.push(item)
              completed++
              return next()
            })
          }
        }
        next()
      }
    },
    importOkClick () {
      this.importStatusObj = []
    },
    backupOkClick () {
      this.statusObj = []
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
    createWhc () {
      this.$router.push('/walletAssets')
    }
  }
}
</script>

<style lang="scss">
    .overview-body{
        padding: 40px 20px;
        .unconfirmed{
          display: inline-block;
          background: rgba(255,247,245,.8);
          color: #ff5c36;
          font-size: 12px;
          padding: 5px;
          margin-right: 5px;
        }
        .confirmed{
          display: inline-block;
          background: rgba(235,250,234,.8);
          color: #59c754;
          font-size: 12px;
          padding: 5px;
          margin-right: 5px;
        }
        .center-td{
          padding-right: 0px;
        }
        .td-right{
          padding-left: 0;
        }
        .table-number{
          display: inline-block;
          color: #0a1f44;
          font-size: 16px;
          font-weight: 500;
          width: 100px;
          text-align: left;
        }
        .send-arrow{
            display: inline-block;
            height:13px;
            width:13px;
            background-image: url('../../../../public/img/ic-arrow-upward.png');
            background-size: cover;
        }
        .receive-arrow{
            display: inline-block;
            height:13px;
            width:13px;
            background-image: url('../../../../public/img/ic-arrow-downwardpng.png');
            background-size: cover;
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
        .card-container{
          display: flex;
          padding: 0 16px;
          margin-top: 20px;
          .item{
            display: flex;
            flex-direction: column;
            flex: 1;
            box-sizing: border-box;
            padding: 28px;
            height: 199px;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 8px 10px 0 rgba(10, 31, 68, 0.1), 0 0 1px 0 rgba(10, 31, 68, 0.08);
            background-color: #ffffff;
            background-image: url('../../../../public/img/w_back.png');
            background-size: contain;
            background-position: right;
            background-repeat: no-repeat;
            &:first-child{
              margin-right: 40px
            }
            .title{
              font-size: 20px;
              font-weight: 500;
              color: #53627c;
            }
            .desc{
              font-size: 14px;
              color: #a6aebc;
              line-height: 1.5;
              margin-top: 15px;
            }
            .btn-container{
              display: flex;
              justify-content: flex-end;
              flex:1;
              align-items: center;
            }
          }
        }
        .list-container{
            .q-item-main{
                font-size: 18px;
                color: #53627c;
                font-weight: 500;
            }
            .q-item{
            }
            .q-collapsible-inner{
              margin-top: 10px;
            }
        }
        .coll-title-container{
            margin-top: 30px;
            opacity: 1!important;
            color: #0a1f44;
            .arrow{
              visibility: hidden;
            }
            .q-item{
              font-size: 20px;
              font-weight: 900;
            }
        }
        .small-margin-right{
          margin-right: 5px;
        }
        .item-main{
           flex: 1 0 0;
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
