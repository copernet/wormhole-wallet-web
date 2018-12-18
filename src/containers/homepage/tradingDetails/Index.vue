<template lang="pug">
    div
        q-table(
        :data="tradeData"
        :columns="columns"
        row-key="name"
        :pagination.sync="pagination"
        hide-bottom
        )
            div(slot="top" slot-scope="props")
                div.q-title.float-left Transaction Inspector
</template>

<script>
import { QSpinnerFacebook } from 'quasar'
import request from '../../../util/request'
import popup from '../../../util/notify'
import { transformType } from '../../../util/transform'

const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }

export default {
  data () {
    return {
      columns: [
        { name: 'Field Name', label: 'Field Name', field: 'name', sortable: false, align: 'left' },
        { name: 'Details', label: 'Details', field: 'value', sortable: false, align: 'left' }
      ],
      tradeData: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0
      }
    }
  },
  methods: {
    goHistoryPage () {
      let propertyid = this.$route.params.propertyId
      let params = { propertyid }
      this.$router.push({ name: 'propertyHistoryPage', params })
    }
  },
  activated () {
    let routeParams = this.$route.params
    this.$q.loading.show(loadingOptions)
    request.getHashDetails(routeParams).then((data) => {
      this.$q.loading.hide()
      if (data.code === 0) {
        if (data.result) {
          let { result } = data
          let resultKeys = Object.keys(result)
          let tradeArr = []
          if (resultKeys.length !== 0) {
            resultKeys.forEach((item) => {
              if (typeof result[item] === 'object') {
                return
              }
              if (result[item] || result[item] === 0) {
                if (item === 'transactionType') {
                  result.transactionType = transformType(result.transactionType)
                }
                tradeArr.push({ name: item, value: result[item] })
              }
            })
            tradeArr.sort((a, b) => {
              return ((a.value + '').length - (b.value + '').length)
            })
          }
          this.tradeData = [...tradeArr]
        }
      } else {
        popup.warning(data.message, this)
      }
    }).catch((error) => {
      this.$q.loading.hide()
      popup.warning(error, this)
    })
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .bottom-button {
        margin-top: 10px;
    }
</style>
