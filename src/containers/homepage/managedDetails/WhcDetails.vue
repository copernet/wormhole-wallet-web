<template lang="pug">
  div(class='container')
      q-tabs(color = 'white' text-color="blue")
          q-tab(
          default
          slot="title"
          name="assetDetails"
          ) {{$t('homePage.myWallet.whcDetails.name')}}

          q-tab(
          slot="title"
          name="history"
          ) History
          q-tab-pane(name="history")
              property-history(:propertyId="propertyid")
          q-tab-pane(name="assetDetails")
              div.row
                div.col-11
                    q-input(
                    :float-label="$t('homePage.myWallet.whcDetails.amount')"
                    v-model="totaltokens"
                    readonly disabled
                    )
              div.row
                div.col-11
                    q-input(
                    :float-label="$t('homePage.myWallet.whcDetails.precision')"
                    readonly disabled
                    v-model="precision"
                    )
              div.row
                div.col-11
                    q-input(
                    :float-label="$t('homePage.myWallet.myAssets.issuance')"
                    v-model="issuer"
                    readonly disabled
                    )
              div.row
                div.col-11
                    q-input(
                    :float-label="$t('homePage.myWallet.whcDetails.url')"
                    v-model="url"
                    readonly disabled
                    )
              div.row
                  div.col-11
                      q-input(
                      v-model="data"
                      :float-label="$t('homePage.myWallet.whcDetails.note')"
                      readonly disabled
                      )
              div.row.bottom-button
                  div.col-1
                      q-btn.full-width(
                      color="primary"
                      @click="goBack"
                      ) {{$t('homePage.myWallet.whcDetails.back')}}
</template>

<script>
import QBtn from 'quasar-framework/src/components/btn/QBtn'
import PropertyHistory from '../propertyHistory/Index'

export default {
  components: { QBtn, PropertyHistory },
  data () {
    return {
      precision: '',
      issuer: '',
      url: '',
      data: '',
      propertyid: ''
    }
  },
  activated () {
    let routeParams = this.$route.params
    let { totaltokens, precision, issuer, url, data } = routeParams.propertyReadOnly
    this.totaltokens = totaltokens
    this.precision = precision
    this.issuer = issuer
    this.url = url
    this.data = data
    this.propertyid = this.$route.params.propertyReadOnly.propertyid
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
    .whc-title {
        margin: 10px 0 30px;
    }
    .bottom-button {
        margin-top: 50px;
    }
</style>
