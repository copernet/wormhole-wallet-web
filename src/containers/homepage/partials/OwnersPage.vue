<template lang="pug">
    div
        q-table(
            :title="$t('homePage.owners.title')"
            :data="ownersData"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="name"
            hide-bottom
            )
            q-tr(
            slot="body"
            slot-scope="props"
            :props="props"
            )
                q-td {{ props.row.Address }}
                q-td {{ props.row.balance_available }}
                q-td {{ props.row.Status ? 'Frozen' : 'Confirm' }}
                q-td
                    q-btn(
                    v-if="!isReadOnly && detailData.freezingenabled && props.row.balance_available && props.row.balance_available !== '0' "
                    @click="goOperationPage(props.row)"
                    style="width: 100px"
                    size="sm"
                    :color="props.row.Status ? 'info' : 'negative'"
                    :label="props.row.Status ? 'Unfreeze' : 'Freeze'"
                    )
                    span(v-else) -
        Operates(:isOpen="openOperates" @cancel="cancelDia" :operatesData="operatesData" :detailData="detailData")
        div(style="height: 10px")
        q-pagination(:max-pages="10" v-model="page"  :max="maxPage" direction-links @input="getOwnersData")
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notify'
import Operates from './Operates'
import { QSpinnerFacebook } from 'quasar'
const loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
export default {
  data () {
    return {
      columns: [
        { name: 'Address', label: 'Owners Address', align: 'left' },
        { name: 'amount', label: 'Amount', align: 'left' },
        { name: 'status', label: 'Status', align: 'left' },
        { name: 'management', label: 'Management', align: 'left' }
      ],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      operatesData: {},
      openOperates: false,
      oldId: '',
      oldPage: '',
      ownersData: [],
      page: 1,
      pageSize: 15,
      maxPage: 0
    }
  },
  props: ['detailData', 'isReadOnly'],
  components: { Operates },
  methods: {
    cancelDia () {
      this.openOperates = false
    },
    goOperationPage (data) {
      this.operatesData = { ...data }
      this.openOperates = true
    },
    getOwnersData () {
      let id = this.detailData.propertyid
      if (this.oldId && this.oldId === id && this.oldPage === this.page) {
        return
      }
      let { page, pageSize } = this
      let params = { pageSize, pageNo: page }
      this.$q.loading.show(loadingOptions)
      this.oldPage = page
      request.getOwnersList(id, params).then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          let total = result.total
          this.oldId = id
          this.maxPage = Math.ceil(total / pageSize)
          this.ownersData = [ ...result.list ]
        } else {
          this.oldPage = ''
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.oldPage = ''
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    }
  },
  mounted () {
    this.getOwnersData()
  }
}
</script>

<style lang="scss" scoped>
</style>
