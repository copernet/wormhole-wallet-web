<template lang="pug">
    div.container.smart-p-container
        div.q-title {{$t('homePage.myWallet.crowdSale.title')}}
            a(
                style="text-decoration: none;"
                :title="$t('homePage.myWallet.myAssets.protocol')"
                target="_blank" href="https://github.com/copernet/spec/blob/master/wormhole-spec-en.md#create-crowdfunding-token-51"
                )
                q-icon.whc-protocol(name="help_outline")
                    q-tooltip(anchor="bottom middle" self="top left") {{$t('homePage.myWallet.myAssets.protocol')}}
        div
            div.row
                div(class="col-4")
                    q-field(:error-label="label.required")
                        q-input(:float-label="$t('homePage.myWallet.crowdSale.name')" v-model="formData.propertyName" :error="propertyNameStatus")
                div(class="col-5 offset-1")
                    q-field(:error-label="label.errorUrl")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.url')"
                        v-model="formData.propertyUrl"
                        :error="urlStatus"
                        )
            div.row
                div(class="col-4")
                    q-select(
                        :stack-label="$t('homePage.myWallet.crowdSale.category')"
                        separator
                        v-model="formData.categoryAddress"
                        :options="propertyCategory"
                        )
                div.col-5.offset-1
                    q-select(
                    :stack-label="$t('homePage.myWallet.crowdSale.subCategory')"
                    separator
                    v-model="formData.subcategoryAddress"
                    :options="propertySubcategory"
                    )
            div.row
                div.col-10
                    q-field(:error-label="label.errorDes")
                        q-input(
                        type="textarea"
                        :float-label="$t('homePage.myWallet.crowdSale.smartDes')"
                        :max-height="100"
                        v-model="formData.propertyData"
                        :error="propertyDataStatus"
                        )
            div.row
                div.col-4
                    q-select(
                    :stack-label="$t('homePage.myWallet.crowdSale.precision')"
                    separator
                    v-model="formData.precision"
                    :options="precisionData"
                    )
                div.col-5.offset-1
                    q-field(:error-label="amountBasic")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.total_number')"
                        v-model="formData.totalNumber"
                        :error="totalNumberStatus"
                        )
            div.row
                div.col-4
                    q-field(:error-label="amountRange")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.tokens')"
                        v-model="formData.numberProperties"
                        :error="numberPropertiesStatus"
                        )
                div.col-5.offset-1
                    q-field(:error-label="$t('homePage.myWallet.crowdSale.bonusRequired')")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.bonus')"
                        v-model="formData.bonus"
                        :error="bonusStatus"
                        suffix ="%"
                        )
            div.row
                div.col-4
                    q-field(:error-label="$t('homePage.myWallet.crowdSale.required')")
                        q-input(
                        :float-label="$t('homePage.myWallet.crowdSale.fees')"
                        placeholder="0.002"
                        v-model="formData.minerFees"
                        :error="feesStatus || availableStatus"
                        readonly disabled
                        )
                    div.row(style="margin-top: 7px")
                        div.col-4
                            q-radio(v-model="formData.minerFees" :val="feeData.fast" :label="$t('homePage.myWallet.choseFees.fast')")
                        div.col-4
                            q-radio(v-model="formData.minerFees" :val="feeData.normal" :label="$t('homePage.myWallet.choseFees.normal')")
                        div.col-4
                            q-radio(v-model="formData.minerFees" :val="feeData.slow" :label="$t('homePage.myWallet.choseFees.slow')")
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
                    q-datetime(
                    v-model="formData.deadline"
                    type="datetime"
                    :float-label="$t('homePage.myWallet.crowdSale.deadline')"
                    :min="minDate"
                    :error="dateStatus"
                    )
            div.row
                div.col-10
                    q-select(
                    :stack-label="$t('homePage.myWallet.crowdSale.address')"
                    separator
                    v-model="formData.selectedAddress"
                    :options="formData.issuerData"
                    )
        div(style="height: 10px")
        div.row
            div.col-2
                q-btn(
                color="light-blue-5"
                class="full-width"
                :disable="factorageStatus || availableStatus || bonusStatus || dateStatus || totalNumberStatus || numberPropertiesStatus || propertyNameStatus || feesStatus || categoryStatus || urlStatus || propertyDataStatus"
                @click="submitTransaction"
                ) {{$t('homePage.myWallet.next')}}
</template>

<script>
import Balance from '../partials/Balance'
import request from '../../../util/request'
import popup from '../../../util/notify'
import timeFunc from '../../../util/dates'
import { QSpinnerFacebook, date } from 'quasar'
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
        categoryAddress: 0,
        subcategoryAddress: 0,
        propertyName: '',
        propertyUrl: 'http://',
        propertyData: '',
        minerFees: '',
        issuerData: [],
        selectedAddress: 0,
        deadline: null,
        bonus: '',
        numberProperties: '',
        precision: 8,
        totalNumber: ''
      },
      feeData: {
        fast: null,
        normal: '',
        slow: undefined
      },
      minDate: ''
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
      },
      totalNumber: {
        required
      },
      bonus: {
        required
      },
      deadline: {
        required
      }
    }
  },
  computed: {
    customerAddresses: vm => {
      return vm.$store.state.accountModule.account_wallet.addresses || ''
    },
    // get whc balance
    whcBalance: vm => {
      let balance = getWhcBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.whc)
      return balance
    },
    factorageStatus: vm => {
      if (vm.factorage) {
        return false
      }
      return true
    },
    factorage: vm => {
      if (parseFloat(vm.whcBalance) >= 1) {
        return 1
      }
      return 0
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
    amountRange: vm => {
      let str
      str = `0.00000001 ~ 100000000`
      return str
    },
    amountBasic: vm => {
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
    numberPropertiesStatus: vm => {
      let { numberProperties } = vm.formData
      if (isNum(numberProperties) && vm.$v.formData.numberProperties.required) {
        let numberPropertiesBig = new Big(numberProperties)
        let numberMaxBig = new Big('100000000')
        if (numberPropertiesBig.gte(0.00000001) && numberPropertiesBig.lte(numberMaxBig)) {
          return false
        }
      }
      return true
    },
    totalNumberStatus: vm => {
      let { totalNumber, precision } = vm.formData
      if (isNum(totalNumber) && vm.$v.formData.totalNumber.required) {
        let totalNumberBig = new Big(totalNumber)
        let factor = Math.pow(10, precision)
        let maxBig = new Big('9223372036854775807').div(factor)
        if ((totalNumberBig.gte(0.00000001)) && totalNumberBig.lte(maxBig)) {
          let index = totalNumber.indexOf('.')
          let length
          if (index === -1) { return false }
          length = totalNumber.split('.')[1].length
          if (length <= precision) { return false }
        }
      }
      return true
    },
    dateStatus: vm => {
      let deadline = vm.formData.deadline
      let now = new Date()
      if (vm.$v.formData.deadline.required && deadline > now) {
        return false
      }
      return true
    },
    bonusStatus: vm => {
      let bonus = vm.formData.bonus
      if (isNum(bonus) && vm.$v.formData.bonus.required && bonus >= 0 && bonus <= 255) {
        return false
      }
      return true
    },
    bchBalance: vm => {
      let balance = getBalance(vm.customerAddresses[vm.formData.selectedAddress], vm.$store.state.walletModule.bch)
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
      let { totalNumber, deadline, bonus, precision, numberProperties, propertyData, propertyUrl, propertyName, selectedAddress, categoryAddress, subcategoryAddress } = this.formData
      let { propertyCategory, propertySubcategory } = this
      let texData = {
        transaction_version: 0,
        ecosystem: 1,
        previous_property_id: 0,
        property_category: propertyCategory[categoryAddress].label || '',
        property_subcategory: propertySubcategory[subcategoryAddress].label || '',
        property_name: propertyName,
        property_url: propertyUrl || '',
        property_data: propertyData || '',
        number_properties: numberProperties + '',
        currency_identifier_desired: 1,
        precision: precision,
        earlybird_bonus: bonus,
        deadline: date.formatDate(deadline, 'UniX').substring(3),
        total_number: new Big(totalNumber).valueOf()
      }
      let transactionData = transaction(51, this.customerAddresses[selectedAddress], fee, texData)
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
    if (this.customerAddresses.length && JSON.stringify(bch) !== '{}') {
      this.formData.issuerData = this.customerAddresses.map((item, index) => {
        let cacheBalance = getBalance(item, bch)
        return { label: `${item.address}  ( ${cacheBalance} bch available )`, value: index }
      })
      this.formData.selectedAddress = 0
    }
    // get category
    this.getCaData()
    // get time limit
    this.minDate = timeFunc.getNow(date)
    this.formData.deadline = timeFunc.getNow(date)
    // get fees
    this.getFees()
  },
  deactivated () {
    this.$destroy()
  },
  components: { Balance }
}

</script>

<style lang="scss" scoped>
    .smart-p-container {
      .whc-protocol {
        color: #027be3;
        font-size: 18px;
        margin-left: 10px;
      }
    }
</style>
