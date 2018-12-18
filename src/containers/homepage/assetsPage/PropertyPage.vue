<template lang="pug">
    div.container.smart-p-container
        div.q-title.topic {{propertyType =='smartProperty' ? $t('homePage.myWallet.smartP.title') : $t('homePage.myWallet.managedP.title')}}
            a(
                style="text-decoration: none;"
                :title="$t('homePage.myWallet.myAssets.protocol')"
                target="_blank"
                :href="protocolHref"
                )
                q-icon.whc-protocol(name="help_outline")
                    q-tooltip(anchor="bottom middle" self="top left") {{$t('homePage.myWallet.myAssets.protocol')}}
        div
            div(class='row')
                div(class="col-4")
                    q-field(:error-label="label.required")
                        q-input(
                            :float-label="$t('homePage.myWallet.managedP.name')"
                            v-model="formData.propertyName"
                            :error="propertyNameStatus"
                            placeholder="example:RickCoin"
                            )
                div(class="col-5 offset-1")
                    q-field(:error-label="label.errorUrl")
                        q-input(:float-label="$t('homePage.myWallet.smartP.url')" v-model="formData.propertyUrl" :error="urlStatus")
            div(class='row')
                div(class="col-4")
                    q-select(
                        :stack-label="$t('homePage.myWallet.smartP.category')"
                        separator
                        v-model="formData.categoryAddress"
                        :options="propertyCategory"
                        )
                div(class="col-5").offset-1
                    q-select(
                    :stack-label="$t('homePage.myWallet.smartP.subCategory')"
                    separator
                    v-model="formData.subcategoryAddress"
                    :options="propertySubcategory"
                    )
            div(class="row")
                div.col-10
                    q-field(:error-label="label.errorDes")
                        q-input(
                        type="textarea"
                        :float-label="$t('homePage.myWallet.smartP.smartDes')"
                        :max-height="100"
                        v-model="formData.propertyData"
                        :error="propertyDataStatus"
                        )
            div.row(v-if=" propertyType =='smartProperty' ")
                div(class="col-10")
                    q-field(:helper="amountRange")
                        q-input(
                        :float-label="$t('homePage.myWallet.smartP.tokenNum')"
                        v-model="formData.numberProperties"
                        :error="numberPropertiesStatus"
                        )
            div(class='row')
                div(class="col-10")
                    q-field(:error-label="$t('homePage.myWallet.smartP.required')")
                        q-input(
                        :float-label="$t('homePage.myWallet.smartP.fees')"
                        placeholder="0.002"
                        v-model="formData.minerFees"
                        :error="(feesStatus || availableStatus)"
                        readonly disabled
                        )
            div(style="height: 5px")
            div.row
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.fast" :label="feeLabel.fast")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.normal" :label="feeLabel.normal")
                div.col-2
                    q-radio(v-model="formData.minerFees" :val="feeData.slow" :label="feeLabel.slow")
            div.row
                div.col-4
                    q-select(
                    :stack-label="$t('homePage.myWallet.smartP.precision')"
                    separator
                    v-model="formData.precision"
                    :options="precisionData"
                    )
                div.col-5.offset-1
                    q-input(
                    :float-label="$t('homePage.myWallet.smartP.factorage')"
                    v-model="factorage"
                    :error="factorageStatus"
                    readonly disabled
                    suffix="WHC"
                    )
                    balance(factorage="WHC" :balance="whcBalance" currency="WHC" description="(need 1)")
            div.row
                div.col-10
                    q-select(
                    :stack-label="$t('homePage.myWallet.smartP.address')"
                    separator
                    v-model="formData.selectedAddress"
                    :options="formData.issuerData"
                    )
        div(style="height: 30px")
        div.row
            div.col-2
                q-btn.full-width(
                color="light-blue-5"
                class="full-width"
                :disable="factorageStatus || availableStatus || propertyNameStatus || numberPropertiesStatus || feesStatus || categoryStatus || urlStatus || propertyDataStatus"
                @click="submitTransaction"
                ) {{$t('homePage.myWallet.next')}}
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notify'
import Balance from '../partials/Balance'
import { QSpinnerFacebook } from 'quasar'
import { required, url } from 'vuelidate/lib/validators'
import { transaction, confirm } from '../../../util/transaction'
import { isNum, getBalance, getWhcBalance, calculateByte } from '../../../util/transform'
import { Big } from 'big.js'
let { warning } = popup
let loadingOptions = { spinner: QSpinnerFacebook, spinnerColor: 'light-blue' }
let categoryData = []
export default {
  data () {
    return {
      label: {
        errorUrl: 'example:http://www.someProperty.com',
        errorDes: '',
        required: ''
      },
      propertyCategory: [], // category options
      precisionData: [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 }
      ],
      formData: {
        precision: 8,
        categoryAddress: 0,
        subcategoryAddress: 0,
        propertyName: '',
        propertyUrl: 'http://',
        propertyData: '',
        numberProperties: '',
        minerFees: '',
        issuerData: [],
        selectedAddress: 0
      },
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      feeLabel: {
        fast: this.$t('homePage.myWallet.choseFees.fast'),
        normal: this.$t('homePage.myWallet.choseFees.normal'),
        slow: this.$t('homePage.myWallet.choseFees.slow')
      },
      propertyType: ''
    }
  },
  validations: {
    formData: {
      propertyName: {
        required
      },
      numberProperties: {
        required
      },
      minerFees: {
        required
      },
      propertyUrl: {
        required,
        url
      },
      propertyData: {
        required
      }
    }
  },
  computed: {
    customerAddresses: vm => {
      return vm.$store.state.accountModule.account_wallet.addresses || ''
    },
    protocolHref: vm => {
      if (vm.propertyType === 'smartProperty') {
        return 'https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#create-fixed-amount-token-50'
      }
      return 'https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#create-manageable-token-54'
    },
    amountRange: vm => {
      let Range = vm.formData.precision
      let str
      let begin
      let factor = Math.pow(10, Range)
      let maxBig = new Big('9223372036854775807').div(factor)
      Range = -parseInt(Range)
      begin = Math.pow(10, Range)
      str = `${begin} ~ ${maxBig} (precision = ${vm.formData.precision})`
      return str
    },
    // subcategory options
    propertySubcategory: (vm) => {
      let propertyCategory = vm.propertyCategory
      let { categoryAddress } = vm.formData
      if (propertyCategory.length) {
        let subArr = categoryData[propertyCategory[categoryAddress].label]
          .map((item, index) => { return { label: item, value: index } })
        vm.formData.subcategoryAddress = 0
        return subArr
      }
      return []
    },
    // validate
    propertyNameStatus: vm => {
      vm.label.required = 'example: RickyCoin'
      if (vm.$v.formData.propertyName.required) {
        let propertyName = vm.formData.propertyName
        let len
        if (propertyName.toLowerCase().trim() === 'bch' || propertyName.toLowerCase().trim() === 'whc') {
          vm.formData.propertyName = ''
          return true
        }
        len = calculateByte(propertyName)
        if (len <= 20) {
          return false
        } else {
          vm.label.required = '20 English letters or 5 Chinese characters'
        }
      }
      return true
    },
    numberPropertiesStatus: vm => {
      let { numberProperties, precision } = vm.formData
      if (vm.propertyType !== 'smartProperty') {
        return false
      }
      if (isNum(numberProperties) && vm.$v.formData.numberProperties.required) {
        let numberPropertiesBig = new Big(numberProperties)
        let factor = Math.pow(10, precision)
        let maxBig = new Big('9223372036854775807').div(factor)
        if (numberPropertiesBig.gte(0.00000001) && numberPropertiesBig.lte(maxBig)) {
          let index = numberProperties.indexOf('.')
          let length
          if (index === -1) { return false }
          length = numberProperties.split('.')[1].length
          if (length <= precision) { return false }
        }
      }
      return true
    },
    feesStatus: vm => {
      return !(isNum(vm.formData.minerFees) && vm.$v.formData.minerFees.required && (vm.formData.minerFees >= 0.00000001))
    },
    categoryStatus: vm => {
      if (vm.propertyCategory.length === 0 || vm.propertySubcategory.length === 0) {
        return true
      } else {
        return false
      }
    },
    urlStatus: vm => {
      vm.label.errorUrl = 'example:http://www.someProperty.com'
      if (vm.$v.formData.propertyUrl.required && vm.$v.formData.propertyUrl.url) {
        let len = calculateByte(vm.formData.propertyUrl)
        if (len <= 40) {
          return false
        } else {
          vm.label.errorUrl = '40 English letters'
        }
      }
      return true
    },
    propertyDataStatus: vm => {
      vm.label.errorDes = ''
      if (vm.$v.formData.propertyData.required) {
        let len = calculateByte(vm.formData.propertyData)
        if (len <= 56) {
          return false
        } else {
          vm.label.errorDes = '56 English letters or 14 Chinese characters'
        }
      }
      return true
    },
    factorageStatus: vm => {
      if (vm.factorage) {
        return false
      }
      return true
    },
    // get bch balance
    bchBalance: vm => {
      let balance = 0
      if (vm.customerAddresses) {
        balance = getBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.bch)
      }
      return balance
    },
    availableStatus: vm => {
      let { minerFees } = vm.formData
      if (minerFees) {
        if (minerFees <= vm.bchBalance) {
          return false
        }
      }
      return true
    },
    // get whc balance
    whcBalance: vm => {
      let balance = 0
      if (vm.customerAddresses) {
        balance = getWhcBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc)
      }
      return balance
    },
    factorage: vm => {
      if (parseFloat(vm.whcBalance) >= 1) {
        return 1
      }
      return 0
    }
  },
  methods: {
    // get fee status
    getFees () {
      this.$q.loading.show(loadingOptions)
      request.getTranscationFees().then((data) => {
        this.$q.loading.hide()
        if (data.code === 0) {
          let result = data.result
          this.feeData.fast = result.Fast + ''
          this.feeData.normal = result.Normal + ''
          this.feeData.slow = result.Slow + ''
          this.formData.minerFees = result.Normal + ''
        } else {
          popup.warning(data.message, this)
        }
      }).catch((error) => {
        this.$q.loading.hide()
        popup.warning(error, this)
      })
    },
    // assetCreation
    assetCreation () {
      let fee = new Big(this.formData.minerFees)
      let { precision, numberProperties, propertyData, propertyUrl, propertyName, selectedAddress, categoryAddress, subcategoryAddress } = this.formData
      let { propertyCategory, propertySubcategory, propertyType } = this
      let texData = {
        transaction_version: 0,
        ecosystem: 1,
        previous_property_id: 0,
        property_category: propertyCategory[categoryAddress].label || '',
        property_subcategory: propertySubcategory[subcategoryAddress].label || '',
        property_name: propertyName,
        property_url: propertyUrl || '',
        property_data: propertyData || '',
        precision: precision
      }
      let urlParams
      let transactionData
      if (propertyType === 'smartProperty') {
        urlParams = 50
        texData.number_properties = numberProperties + ''
        texData.previous_property_id = 0
      } else {
        texData.previous_property_id = 1
        urlParams = 54
      }
      if (this.customerAddresses) {
        transactionData = transaction(urlParams, this.customerAddresses[selectedAddress], fee, texData)
      }
      if (transactionData) {
        return { ...transactionData }
      } else {
        return false
      }
    },
    getOptions (data) {
      let arr = Object.keys(data)
      arr.length && arr.forEach((item, index) => {
        this.propertyCategory.push({ label: item, value: index })
      })
      // this.formData.categoryAddress = 0
    },
    getCaData () {
      request.get_categories().then((data) => {
        if (data.code === 0) {
          categoryData = data.result
          this.getOptions(categoryData)
        } else {
          data.message && warning(data.message, this)
        }
      }).catch((error) => {
        warning(error, this)
      })
    },
    submitTransaction () {
      let transaction = this.assetCreation()
      confirm(this, loadingOptions, transaction, false)
    }
  },
  activated () {
    let bch = this.$store.state.walletModule.bch
    // get address
    this.propertyType = this.$route.params.propertyType
    if (this.customerAddresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.customerAddresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
      this.formData.selectedAddress = 0
    }
    // get category
    this.getCaData()
    // get fee choice
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  },
  components: { Balance }
}

</script>

<style lang="scss" scoped>
    .smart-p-container{
      .topic {
        /*margin-top: 20px;*/
      }
      .whc-protocol {
        color: #027be3!important;
        font-size: 18px;
        margin-left: 10px;
      }
    }
</style>
