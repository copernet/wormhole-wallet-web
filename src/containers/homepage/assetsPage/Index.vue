<template lang="pug">
    div
        q-table(
            :columns="columns"
            color="primary"
            row-key="propertyid"
            :data="assetsData"
            :pagination.sync="pagination"
            hide-bottom
            )
            q-tr(
            slot="body"
            slot-scope="props"
            :props="props"
            style="cursor: pointer"
            )
                q-td(@click.native="jumpToDetails(props.row.detailsIndex)") {{ props.row.propertyid }}
                q-td(@click.native="jumpToDetails(props.row.detailsIndex)") {{ props.row.name }}
                q-td(@click.native="jumpToDetails(props.row.detailsIndex)") {{ props.row.totaltokens }}
                q-td(@click.native="jumpToDetails(props.row.detailsIndex)")
                    div.property-url {{ props.row.url }}
                            q-tooltip(anchor="bottom middle" self="top left") {{props.row.url}}
                q-td(@click.native="jumpToDetails(props.row.detailsIndex)") {{ props.row.blockCreateTime }}
                q-td(@click.native="jumpToDetails(props.row.detailsIndex, true)")
                    div.tx-hash
                        a(href="javascript:;" :title="props.row.creationtxid").hash-link {{ props.row.creationtxid }}
                        q-tooltip(anchor="center left" self="center right") {{ props.row.creationtxid }}
            div(slot="top" slot-scope="props" class="row justify-end fit")
                q-btn-dropdown(style="width: 180px" :label="$t('homePage.myWallet.create')").common-btn
                    q-list(link)
                        q-item(@click.native="openDialog('createWhcPage')" v-close-overlay) {{$t('homePage.myWallet.whc')}}
                        q-item(@click.native="openDialog('smartProperty')" v-close-overlay) {{$t('homePage.myWallet.smartP.name')}}
                        q-item(@click.native="openDialog('managedPage')" v-close-overlay) {{$t('homePage.myWallet.managedP.name')}}
                        q-item(@click.native="openDialog('createCrowdPage')" v-close-overlay) {{$t('homePage.myWallet.crowdSale.name')}}
                        q-item(@click.native="openDialog('createSendAllPage')" v-close-overlay) {{$t('homePage.myWallet.sendAll.name')}}
                        q-item(@click.native="openDialog('createAirDrop')" v-close-overlay) {{$t('homePage.myWallet.airDrop.name')}}
        div(style="height: 10px")
        q-pagination(:max-pages="10" v-model="page"  :max="maxPage" direction-links @input="getAssets")
</template>
<script>
import { QSpinnerFacebook, date } from 'quasar'
import WhcPage from './WhcPage'
import PropertyPage from './PropertyPage'
import CrowdSale from './CrowdPage'
import SendAll from './SendAllPage'
import AirDrop from './AirDrop'
import request from '../../../util/request'
import popup from '../../../util/notify'
import commonUtil from '../../../util/common'
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('accountModule')
const { warning } = popup
const { getAssetList } = request
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      dialogType: '',
      columns: [
        {
          name: 'id',
          required: true,
          label: this.$t('homePage.myWallet.myAssets.pId'),
          align: 'left'
        },
        { name: 'name', label: this.$t('homePage.myWallet.myAssets.pName'), align: 'left' },
        { name: 'amount', label: this.$t('homePage.myWallet.myAssets.pAmount'), align: 'left' },
        { name: 'url', label: this.$t('homePage.myWallet.myAssets.pUrl'), align: 'left' },
        { name: 'blockCreateTime', label: this.$t('homePage.myWallet.myAssets.blockCreateTime'), align: 'left' },
        { name: 'TxHash', label: 'TxHash', align: 'left' }
      ],
      assetsData: [],
      detailsData: [],
      propertyType: 'smartProperty', // Differentiates properties
      oldParams: {
        addressStr: '',
        page: ''
      },
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      page: 1,
      maxPage: 0,
      pageSize: 15
    }
  },
  computed: {
    ...mapState(['account_wallet'])
  },
  methods: {
    openDialog (route) {
      if (route === 'smartProperty') {
        let params = { propertyType: route }
        return this.$router.push({ name: 'createPropertyPage', params })
      }
      if (route === 'managedPage') {
        let params = { propertyType: route }
        return this.$router.push({ name: 'createPropertyPage', params })
      }
      this.$router.push({ name: route })
    },
    jumpToDetails (index, toHash = false) {
      let params = this.assetsData[index]
      let type = this.detailsData[index].type_int
      if (toHash) {
        let hashParams = {}
        if (this.assetsData[index] && this.assetsData[index].creationtxid) {
          hashParams = { txHash: this.assetsData[index].creationtxid, propertyId: this.assetsData[index].propertyid }
          return this.$router.push({ name: 'tradingDetails', params: hashParams })
        }
      }
      if (type === 51) {
        this.$router.push({ name: 'crowdDetails', params })
      }
      if (type === 50 || type === 54) {
        params.type_int = type
        this.$router.push({ name: 'propertyDetails', params })
      }
    },
    getAssets () {
      if (this.account_wallet.addresses) {
        let { addresses } = this.account_wallet
        let addressArr = addresses.map((item) => {
          return item.address
        })
        let addressStr = commonUtil.generateQsArrayString('address', addressArr)
        let { page, pageSize } = this
        if (this.oldParams.addressStr === addressStr && this.oldParams.page === page) {
          return
        }
        this.$q.loading.show(loadingOptions)
        getAssetList(addressStr, page).then((data) => {
          this.$q.loading.hide()
          if (data.code === 0) {
            let resultArr
            this.assetsData.splice(0)
            if (Array.isArray(data.result)) {
              resultArr = data.result
              this.maxPage = 0
            } else {
              resultArr = data.result.list
              this.maxPage = Math.ceil(data.result.total / pageSize)
              this.oldParams.addressStr = addressStr
              this.oldParams.page = page
            }
            this.assetsData = resultArr.map((item, index) => {
              item.PropertyData.detailsIndex = index
              if (item.TxData && item.TxData.blocktime) {
                item.PropertyData.blockCreateTime = date.formatDate((parseFloat(item.TxData.blocktime) * 1000), 'YYYY-MM-DDTHH:mm:ss')
              } else {
                item.PropertyData.blockCreateTime = ''
              }
              return item.PropertyData
            })
            this.detailsData = resultArr.map((item, index) => {
              return item.TxData
            })
          } else {
            warning(data.message, this)
          }
        }).catch((error) => {
          this.$q.loading.hide()
          warning(error, this)
        })
      }
    }
  },
  components: { WhcPage, PropertyPage, CrowdSale, SendAll, AirDrop },
  activated () {
    this.getAssets()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .tx-hash {
        width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .property-url {
        width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hash-link {
        color: #12820d;
    }
    .common-btn {
        color: #fff;
        font-weight: 500;
        box-sizing: border-box;
        background-image: linear-gradient(257deg, #5ba7ff, #624ae8);
    }
</style>
