<template lang="pug">
    div
        q-table(
        :columns="columns"
        color="primary"
        row-key="propertyid"
        :data="crowdData"
        :title="$t('homePage.explorer.activeCrowdSales.exCrowdSales')"
        :pagination.sync="pagination"
        hide-bottom
        )
            q-tr(
            slot="body"
            slot-scope="props"
            :props="props"
            @click.native="jumpToDetails(props.row)"
            style="cursor: pointer"
            )
                q-td
                    div.ellipsis
                        a(:title="props.row.propertyid") {{ props.row.propertyid }}
                q-td
                    div.ellipsis {{ props.row.name }}
                        q-tooltip(anchor="bottom middle" self="top left") {{ props.row.name }}
                q-td
                    div.ellipsis {{ props.row.tokensperunit }}
                        q-tooltip(anchor="bottom middle" self="top left") {{ props.row.tokensperunit }}
                q-td
                    div {{ props.row.deadline }}
                q-td
                    div.ellipsis {{ props.row.purchasedtokens }}
                        q-tooltip(anchor="bottom middle" self="top left") {{ props.row.purchasedtokens }}
                q-td
                    div.ellipsis {{  props.row.totaltokens }}
                        q-tooltip(anchor="bottom middle" self="top left") {{  props.row.totaltokens }}
                q-td
                    div {{ props.row.created }}
        div(style="height:10px")
        q-pagination(:max-pages="10" v-model="pageNo" :max="maxPage" direction-links @input="searchList")
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notify'
import { QSpinnerFacebook, date } from 'quasar'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      columns: [
        { name: 'propertyid', label: 'Property ID', align: 'left' },
        { name: 'name', label: 'Property Name', align: 'left' },
        { name: 'tokensperunit', label: 'Token/WHC', align: 'left' },
        { name: 'deadline', label: 'Time Until Closing', align: 'left' },
        { name: 'tokensissued', label: 'Bought', align: 'left' },
        { name: 'totaltokens', label: 'Created', align: 'left' },
        { name: 'created', label: 'Block Time', align: 'left' }
      ],
      crowdData: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      },
      pageNo: 1,
      maxPage: 0,
      pageSize: 15,
      oldParams: {
        page: ''
      }
    }
  },
  methods: {
    searchList (val) {
      this.getActiveList(val)
    },
    // get history data
    jumpToDetails (params) {
      this.$router.push({ name: 'participateCrowds', params })
    },
    // get list
    getActiveList (pageNo) {
      if (pageNo === this.oldParams.page) {
        return
      }
      this.$q.loading.show(loadingOptions)
      request.getActiveCrowds(pageNo).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          let resultArr
          if (Array.isArray(result)) {
            resultArr = result
          } else {
            resultArr = result.list
            this.maxPage = Math.ceil(result.total / this.pageSize)
            this.oldParams.page = pageNo
          }
          resultArr.forEach((item) => {
            if (item.deadline) {
              item.deadline = date.formatDate((parseFloat(item.deadline) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            }
            if (item.created) {
              item.created = date.formatDate((parseFloat(item.created) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            }
          })
          this.crowdData = [...resultArr]
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
    this.getActiveList(1)
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
    .ellipsis {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
