<template lang="pug">
    div
        q-table(
        :columns="columns"
        color="primary"
        row-key="propertyid"
        :data="assetData"
        :title="$t('homePage.explorer.assets.exAssets')"
        :pagination.sync="pagination"
        hide-bottom
        )
            q-tr(
            slot="body"
            slot-scope="props"
            :props="props"
            style="cursor: pointer"
            )
                q-td(@click.native="jumpToDetails(props.row)") {{ props.row.propertyid }}
                q-td(@click.native="jumpToDetails(props.row)")
                    div.property-url {{ props.row.name }}
                        q-tooltip(anchor="bottom middle" self="top left") {{ props.row.name }}
                q-td(@click.native="jumpToDetails(props.row)") {{ props.row.totaltokens }}
                q-td(@click.native="jumpToDetails(props.row)")
                    div.property-url {{ props.row.url }}
                        q-tooltip(anchor="bottom middle" self="top left") {{props.row.url}}
                q-td(@click.native="jumpToDetails(props.row)")
                    div {{ props.row.created }}
                q-td(@click.native="jumpToDetails(props.row, true)")
                    div.tx-hash
                        a(href="javascript:;").hash-link {{ props.row.creationtxid }}
                        q-tooltip(anchor="center left" self="center right") {{ props.row.creationtxid }}
        div(style="height: 10px")
        q-pagination(@input="getList" :max-pages="10" v-model="page"  :max="maxPage" direction-links)
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notify'
import { QSpinnerFacebook, date } from 'quasar'
import { transformTokens } from '../../../util/transform'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      columns: [
        {
          name: 'propertyid',
          required: true,
          label: 'Property ID',
          align: 'left'
        },
        { name: 'name', label: 'Property Name', align: 'left' },
        { name: 'totaltokens', label: 'Total Amount', align: 'left' },
        { name: 'url', label: 'Url', align: 'left' },
        { name: 'created', label: 'Block Time', align: 'left' },
        { name: 'TxHash', label: 'TxHash', align: 'left' }
      ],
      assetData: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      page: 1,
      maxPage: 0,
      pageSize: 15,
      oldParams: {
        page: ''
      }
    }
  },
  methods: {
  // get history data
    jumpToDetails (property, toHash = false) {
      let pageType = transformTokens(property)
      let params = {
        propertyReadOnly: property,
        READ_ONLY_TYPE: pageType
      }
      if (toHash) {
        let hashParams = {}
        if (property && property.creationtxid) {
          hashParams = { txHash: property.creationtxid, propertyId: property.propertyid }
          return this.$router.push({ name: 'tradingDetails', params: hashParams })
        }
      }
      if (pageType === 'WHC_READ') {
        this.$router.push({ name: 'whcDetails', params })
      }
      if (pageType === 'CROWD_READ') {
        this.$router.push({ name: 'participateCrowds', params: property })
      }
      if (pageType === 'SMART_READ' || pageType === 'MANAGE_READ') {
        this.$router.push({ name: 'propertyDetails', params })
      }
    },
    getList () {
      let { page, pageSize } = this
      if (page === this.oldParams.page) {
        return
      }
      this.$q.loading.show(loadingOptions)
      request.getPropertyList(page).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          let resultArr
          if (Array.isArray(result)) {
            resultArr = result
            this.maxPage = 0
          } else {
            resultArr = result.list
            this.maxPage = Math.ceil(result.total / pageSize)
            this.oldParams.page = page
          }
          this.assetData = resultArr.map((item) => {
            if (item.created) {
              item.created = date.formatDate((parseFloat(item.created) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            } else {
              item.created = ''
            }
            return item
          })
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    }
  },
  activated () {
    this.getList()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .invalid-color {
        color: red;
    }
    .property-url {
        width: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .tx-hash {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hash-link {
        color: #12820d;
    }
</style>
