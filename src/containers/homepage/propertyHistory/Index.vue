<template lang="pug">
    div
        q-table(
            :title="$t('homePage.propertyHistory.title')"
            :data="historyData"
            :columns="columns"
            :pagination.sync="pagination"
            hide-bottom
            )
            q-tr(
            slot="body"
            slot-scope="props"
            :props="props"
            )
                q-td {{ props.row.txid }}
                q-td
                    div.tx-hash {{ props.row.type }}
                        q-tooltip(anchor="bottom middle" self="top left") {{ props.row.type }}
                q-td {{ props.row.amount }}
                q-td {{ props.row.blocktime }}
        div(style="height: 10px")
        q-pagination(:max-pages="10" v-model="page" :min="minPage" :max="maxPage" direction-links @input="goPage")
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notify'
import { transformType } from '../../../util/transform'
import { QSpinnerFacebook, date } from 'quasar'
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      columns: [
        { name: 'txid', label: 'Txid', align: 'left' },
        { name: 'type', label: 'Stage', align: 'left' },
        { name: 'amount', label: 'Amount', align: 'left' },
        { name: 'blocktime', label: 'Time', align: 'left' }
      ],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      oldId: '',
      oldIndex: '',
      historyData: [],
      page: 1,
      minPage: 1,
      maxPage: 0
    }
  },
  props: ['propertyId'],
  methods: {
    goPage (val) {
      this.getHistory(val - 1)
    },
    getHistory (index) {
      let params = { start: index * 15, count: 15 }
      let id = this.propertyId
      if (this.oldId && this.oldId === id && this.oldIndex === index) {
        return
      }
      this.$q.loading.show(loadingOptions)
      request.getPropertyHistory(id, params).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          let total = result.total
          this.oldId = id
          this.oldIndex = index
          this.maxPage = Math.ceil(total / 15)
          this.historyData.splice(0)
          if (!result.transactions) {
            result.transactions = []
          }
          result.transactions.forEach((item) => {
            if (item.blocktime) {
              item.blocktime = date.formatDate((parseFloat(item.blocktime) * 1000), 'YYYY-MM-DDTHH:mm:ss')
            } else {
              item.blocktime = 'pending...'
            }
            item.type = transformType(item.type_int)
            this.historyData.push(item)
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
  mounted () {
    this.getHistory(0)
  }
}
</script>

<style lang="scss" scoped>
    .tx-hash {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
