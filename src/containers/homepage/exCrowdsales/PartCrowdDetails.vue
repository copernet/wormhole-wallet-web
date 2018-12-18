<template lang="pug">
    div(class='container')
        q-tabs(color = 'white' text-color="blue")
            q-tab(
            default
            slot="title"
            name="assetDetails"
            ) {{$t('homePage.explorer.participate.title')}}

            q-tab(
            slot="title"
            name="history"
            ) History
            q-tab-pane(name="history")
                property-history(:propertyId="propertyid")
            q-tab-pane(name="assetDetails")
                div.row
                    div(class="col-4")
                            q-input(:float-label="$t('homePage.myWallet.crowdSale.readName')" v-model="detailData.propertyName" readonly disabled)
                    div(class="col-6 offset-1")
                            q-input(
                            :float-label="$t('homePage.myWallet.crowdSale.url')"
                            v-model="detailData.propertyUrl"
                            readonly disabled
                            )
                div.row
                    div(class="col-4")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.category')"
                        v-model="detailData.categoryAddress"
                        readonly disabled
                        )
                    div(class="col-6 offset-1")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.subCategory')"
                        v-model="detailData.subcategoryAddress"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        v-model="detailData.deadline"
                        :float-label="$t('homePage.myWallet.crowdSale.deadline')"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.bonus')"
                        v-model="detailData.bonus"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.precision')"
                        v-model="detailData.precision"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.tokens')"
                        v-model="detailData.numberProperties"
                        readonly disabled
                        )
                div.row
                    div.col-4
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.total_number')"
                        v-model="detailData.totalNumber"
                        readonly disabled
                        )
                    div.col-6.offset-1
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdDetails.bought')"
                        v-model="detailData.tokensissued"
                        readonly disabled
                        )
                div.row
                    div.col-11
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.address')"
                        v-model="detailData.selectedAddress"
                        readonly disabled
                        )
                div(style="margin-top: 15px")
                div.row
                    div.col-11
                        q-input(
                        type="textarea"
                        :float-label="$t('homePage.myWallet.crowdSale.smartDes')"
                        v-model="detailData.propertyData"
                        readonly disabled
                        )
                div.row.bottom-button(v-if="isActive")
                    div.col-2
                        q-btn.full-width(
                        @click="goPart"
                        color="primary"
                        ) {{$t('homePage.explorer.participate.participate')}}
                div.row.bottom-button(v-else)
                    div.col-2
                        q-btn.full-width(
                        color="primary"
                        @click="goBack"
                        ) {{$t('homePage.myWallet.whcDetails.back')}}
                participate-page(
                    :isOpen="isOpen"
                    @cancel="cancelDialog"
                    :transactionTo="detailData.selectedAddress"
                    :precision="detailData.precision"
                    )
                div(style="height: 60px")
                div(v-if="showRecords")
                    div.row
                        div.col-11
                            q-table(
                            :columns="columns"
                            color="primary"
                            row-key="TxHash"
                            :data="tradeData"
                            :pagination.sync="pagination"
                            hide-bottom
                            title="Transaction Records"
                            )
                                q-tr(
                                slot="body"
                                slot-scope="props"
                                :props="props"
                                @click.native="jumpToDetails(props.row)"
                                style="cursor: pointer"
                                )
                                    q-td
                                        div.tx-hash {{props.row.txid}}
                                            q-tooltip(anchor="bottom middle" self="top left") {{props.row.txid}}
                                    q-td {{props.row.amount}}
                                    q-td {{props.row.purchasedtokens}}
                                    q-td
                                        div.tx-hash {{props.row.type_int}}
                                            q-tooltip(anchor="bottom middle" self="top left") {{props.row.type_int}}
                                    q-td {{props.row.blocktime}}
                                    q-td {{props.row.confirmations}}
                            div(style="height:10px")
                            q-pagination(
                                size="12px"
                                :max-pages="10"
                                v-model="page"
                                :max="maxPage"
                                direction-links
                                @input="getTransactions"
                                )
                div(v-else).caption No Transaction Records ...
</template>

<script>
import QField from 'quasar-framework/src/components/field/QField'
import PropertyHistory from '../propertyHistory/Index'
import ParticipatePage from './partical/ParticipatePage'
import { date } from 'quasar'
import request from '../../../util/request'
import popup from '../../../util/notify'
import { transformType } from '../../../util/transform'

export default {
  data () {
    return {
      detailData: {
        categoryAddress: '',
        subcategoryAddress: '',
        propertyName: '',
        propertyUrl: '',
        minerFees: '',
        selectedAddress: '',
        deadline: null,
        bonus: '',
        numberProperties: '',
        precision: '',
        totalNumber: '',
        propertyData: '',
        tokensissued: ''
      },
      propertyid: '',
      isActive: false,
      isOpen: false,
      page: 1,
      maxPage: 0,
      pageSize: 5,
      columns: [
        { name: 'txid', label: 'Tx Hash', align: 'left' },
        { name: 'amount', label: 'Spent WHC', align: 'left' },
        { name: 'purchasedtokens', label: 'Purchased Tokens', align: 'left' },
        { name: 'type_int', label: 'Type', align: 'left' },
        { name: 'blocktime', label: 'Block Time', align: 'left' },
        { name: 'confirmations', label: 'Confirmations', align: 'left' }
      ],
      tradeData: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      oldParams: {
        id: '',
        page: ''
      }
    }
  },
  validations: {},
  methods: {
    // jump to read trade detail
    jumpToDetails (property) {
      let params = {}
      if (property.txid) {
        params = { txHash: property.txid }
        this.$router.push({ name: 'tradingDetails', params })
      }
    },
    goPart () { this.isOpen = true },
    cancelDialog () { this.isOpen = false },
    goBack () { this.$router.go(-1) },
    formatData () {
      let routeParams = this.$route.params
      this.detailData.propertyName = routeParams.name
      this.detailData.tokensissued = routeParams.purchasedtokens
      this.detailData.propertyUrl = routeParams.url
      this.detailData.categoryAddress = routeParams.category || '-'
      this.detailData.selectedAddress = routeParams.issuer
      this.detailData.deadline = routeParams.deadline
      this.detailData.bonus = routeParams.earlybonus + '%'
      this.detailData.totalNumber = routeParams.totaltokens
      this.detailData.propertyData = routeParams.data
      this.detailData.precision = routeParams.precision
      this.detailData.numberProperties = routeParams.tokensperunit
      this.detailData.subcategoryAddress = routeParams.subcategory || '-'
      this.propertyid = this.$route.params.propertyid
      this.isActive = routeParams.active
    },
    getTransactions () {
      let id = this.$route.params.propertyid
      let { page, pageSize } = this
      if (id === this.oldParams.id && page === this.oldParams.page) {
        return
      }
      request.getCsTransactions(id, page).then((data) => {
        if (data.code === 0) {
          let result = data.result
          if (!result.list) { return }
          this.maxPage = Math.ceil(result.total / pageSize)
          this.oldParams.id = id
          this.oldParams.page = page
          this.tradeData = result.list.map((item) => {
            if (item.blocktime) {
              item.blocktime = date.formatDate((parseFloat(item.blocktime) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            }
            if (item.type_int) {
              item.type_int = transformType(item.type_int)
            }
            return item
          })
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        popup.warning(error, this)
      })
    }
  },
  components: { QField, ParticipatePage, PropertyHistory },
  computed: {
    showRecords: vm => {
      if (vm.tradeData.length !== 0) {
        return true
      }
      return false
    }
  },
  activated () {
    this.formatData()
    this.getTransactions()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .crowd-title {
       margin: 10px 0 30px;
    }
    .bottom-button {
        padding-top: 50px;
    }
    .tx-hash {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
