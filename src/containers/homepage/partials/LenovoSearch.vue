<template lang="pug">
    div
        div.row
            div.col-12
                q-field
                    q-search(
                    v-model="search"
                    @input="searchItem"
                    @blur="hideList"
                    @focus="focusSearch"
                    :error="searchStatus"
                    :placeholder="label.holder"
                    :float-label="label.choose"
                    )
        div.row
            div.col-12(v-if="showSearch").search-container
                div(v-if="notEmpty").search-content
                    q-list(highlight dense)
                        q-item(
                            v-for="(data, index) in listData"
                            :key="data.propertyid"
                            style="cursor:pointer"
                            @click.native="chooseItem(index)"
                            )
                            span {{data.name}}
                            span.p-id (Property Id: {{data.propertyid}})
                div(v-else).search-content
                    q-list(dense v-if="!firstFocus")
                        q-item {{$t('homePage.myWallet.lenovoInput.empty')}}
</template>

<script>
import QList from 'quasar-framework/src/components/list/QList'
import popup from '../../../util/notify'
import axios from 'axios'
import qs from 'qs'
let _cancel = null
let getTargetTokens = (queryStr) => {
  let url = `/property/query`
  let CancelToken = axios.CancelToken
  return axios.post(url, qs.stringify({ keyword: queryStr }), {
    cancelToken: new CancelToken(function executor (c) {
      _cancel = c
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      timeout: 1000 * 60
    },
    baseURL: process.env.VUE_APP_HTTP_BASE_URL || ''
  })
}
export default {
  components: { QList },
  data () {
    return {
      search: '',
      listData: [],
      showSearch: false,
      notEmpty: true,
      cancelTokenFn: null,
      isChosen: false, // click to choose list item
      label: {
        holder: this.$t('homePage.myWallet.lenovoInput.searchPlaceholder'),
        choose: this.$t('homePage.myWallet.lenovoInput.searchTips')
      }
    }
  },
  computed: {
    firstFocus: vm => {
      if (vm.search === '' && vm.listData.length === 0) {
        return true
      }
      return false
    },
    searchStatus: vm => {
      if (vm.search !== '' && vm.listData.length !== 0) {
        let status = false
        if (vm.isChosen) {
          status = vm.listData.some((item) => {
            return item.name === vm.search
          })
        }
        // if ((!vm.isChosen) && vm.listData.length === 1) {
        //   status = vm.listData.some((item) => {
        //     return (item.name === vm.search || parseFloat(item.propertyid) === parseFloat(vm.search))
        //   })
        //   if (status) {
        //     vm.$emit('sendPropertyId', vm.listData[0].propertyid)
        //   }
        // }
        vm.$emit('sendIdStatus', !status)
        return !status
      }
      vm.$emit('sendIdStatus', true)
      return true
    }
  },
  methods: {
    focusSearch () {
      if (this.listData.length !== 0) {
        this.showSearch = true
      }
      this.notEmpty = true
    },
    hideList () {
      this.showSearch = false
    },
    chooseItem (index) {
      this.showSearch = false
      // confirm choice
      this.isChosen = true
      this.search = this.listData[index].name
      // emit choose property id
      this.$emit('sendPropertyId', this.listData[index].propertyid)
    },
    getResource (val) {
      _cancel && _cancel()
      _cancel = null
      if (val === '') {
        this.showSearch = false
        return this.listData.splice(0)
      }
      getTargetTokens(val).then((response) => {
        let data = response.data
        if (data.code === 0) {
          let result = data.result || ''
          if (result && Array.isArray(result) && result.length !== 0) {
            this.isChosen = false
            this.listData = [...result]
            this.showSearch = true
            this.notEmpty = true
          } else {
            this.listData.splice(0)
            this.showSearch = true
            this.notEmpty = false
          }
        } else {
          this.listData.splice(0)
          this.showSearch = true
          this.notEmpty = false
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.listData.splice(0)
        this.showSearch = false
        if (axios.isCancel(error)) {
          return
        }
        popup.warning('Network Error,Please try later', this)
      })
    },
    searchItem (val) {
      this.getResource(val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .search-container {
        position: relative;
        .search-content {
            position: absolute;
            width: inherit;
            opacity: 1;
        }
        .p-id {
            margin-left: 7px;
            font-size: 13px;
            color: grey;
        }
    }
</style>
