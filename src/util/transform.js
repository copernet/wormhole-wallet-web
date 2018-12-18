/**
** @Description: Author Message
** @author Rick
** @date 2018/9/22
**/

// transform assets type
import timeFunc from './dates'
import { date } from 'quasar'
import { Big } from 'big.js'

const transformType = (TxType) => {
  let dicObj
  dicObj = {
    0: 'Assets Sending',
    1: 'Participate Crowdsales',
    3: 'Air Drop',
    4: 'Send All',
    50: 'Create Smart Property',
    51: 'Create Crowdsales',
    53: 'Close Crowdsales',
    54: 'Create Managed Property',
    55: 'Additional Property',
    56: 'Revoke Property',
    68: 'Burn BCH',
    70: 'Change Insuring Address',
    185: 'Freeze Token',
    186: 'Unfreeze token'
  }
  return dicObj[TxType]
}

// transform tokens type (why should front site do this?)
const transformTokens = (propertyData) => {
  let { propertyid, fixedissuance, managedissuance } = propertyData
  if (propertyid === 1) {
    return 'WHC_READ'
  } else if (fixedissuance && !managedissuance) {
    return 'SMART_READ'
  } else if (managedissuance && !fixedissuance) {
    return 'MANAGE_READ'
  } else if (!managedissuance && !fixedissuance) {
    return 'CROWD_READ'
  } else {
    return false
  }
}

// clear formData

const clearForm = (type, vm) => {
  if (type === 'WHC') {
    vm.formData.amount_for_burn = ''
    vm.formData.selectedAddress = 0
    vm.formData.minerFees = ''
    vm.formData.redeemAddress = ''
    vm.showRedeem = false
  }
  if (type === 'PropertyPage') {
    vm.formData.precision = 8
    vm.formData.categoryAddress = 0
    vm.formData.subcategoryAddress = 0
    vm.formData.propertyName = ''
    vm.formData.propertyUrl = 'http://'
    vm.formData.propertyData = ''
    vm.formData.numberProperties = ''
    vm.formData.minerFees = ''
    vm.formData.selectedAddress = 0
  }

  if (type === 'CrowdPage') {
    vm.formData.categoryAddress = 0
    vm.formData.subcategoryAddress = 0
    vm.formData.propertyName = ''
    vm.formData.propertyUrl = 'http://'
    vm.formData.propertyData = ''
    vm.formData.selectedAddress = 0
    vm.formData.bonus = ''
    vm.formData.minerFees = ''
    vm.formData.precision = 8
    vm.formData.totalNumber = ''
    vm.formData.numberProperties = ''
    vm.minDate = timeFunc.getNow(date)
    vm.formData.deadline = timeFunc.getNow(date)
  }

  if (type === 'SendAll') {
    vm.formData.selectedAddress = 0
    vm.formData.minerFees = ''
    vm.formData.redeemAddress = ''
    vm.formData.transactionTo = ''
    vm.showRedeem = false
  }
  if (type === 'AirDrop') {
    vm.formData.selectedAddress = 0
    vm.formData.minerFees = ''
    vm.formData.redeemAddress = ''
    vm.formData.selectedProperty = 0
    vm.formData.amount = ''
    vm.formData.selectedTarget = 0
    vm.showRedeem = false
    vm.showTarget = false
  }
  if (type === 'Participate') {
    vm.formData.amountToTransfer = ''
    vm.formData.selectedAddress = 0
    vm.formData.minerFees = (vm.feeData.normal + '') || ''
    vm.formData.redeemAddress = ''
    vm.showRedeem = false
  }
}

// validate number

const isNum = (num) => {
  let rules = new RegExp('^[1-9]\\d*\\,\\d*|[1-9]\\d*$')
  if (isNaN(num)) {
    return false
  }
  if (num === '0' || num === 0) {
    return true
  }
  if (rules.test(num)) {
    let _num = num + ''
    if (_num.indexOf('.') === -1 || (_num.indexOf('.') !== 0)) {
      return true
    }
  }
  return false
}

// get balance
const getBalance = (addr, bch) => {
  let balance = 0
  if (Array.isArray(bch)) {
    bch.forEach((item) => {
      if (addr.address === item.address) {
        balance = new Big(item.confirmed).plus(item.unconfirmed).valueOf()
      }
    })
  }
  return parseFloat(balance)
}

// get whc balance
const getWhcBalance = (addr, whc, propertyid = 1) => {
  let balance = 0
  if ((!addr) || (!whc) || typeof whc !== 'object') {
    return
  }
  if (Object.keys(whc).length !== 0) {
    if (addr.address in whc) {
      let tokenArr = JSON.parse(JSON.stringify(whc[addr.address]))
      if (tokenArr.length !== 0) {
        tokenArr.forEach((item) => {
          if (item.property_id === propertyid) {
            balance = new Big(item.balance_available).plus(item.pendingneg).plus(item.pendingpos).valueOf()
          }
        })
      }
    }
  }
  return parseFloat(balance)
}

// get token id
const getTokenIds = (addr, whc, bch) => {
  if (Object.keys(whc).length !== 0) {
    let propertyData = []
    let tokenArr = []
    if (addr.address in whc) {
      tokenArr = JSON.parse(JSON.stringify(whc[addr.address]))
      if (bch && Array.isArray(bch)) {
        tokenArr.unshift({ property_name: 'BCH', precision: 8 })
      }
      propertyData = tokenArr.map((item, index) => {
        if (item.property_name === 'BCH' && !item.property_id) {
          return { label: item.property_name, type: 'BCH', value: index, precision: item.precision }
        } else {
          return { label: item.property_name, propertyid: item.property_id, type: 'token', value: index, precision: item.precision }
        }
      })
    }
    return propertyData
  }
}
// calculate byte length
const calculateByte = (str) => {
  let cacheStr = str + ''
  let cacheLength = cacheStr.replace(/[\u0391-\uFFE5]/g, 'rick').length
  return cacheLength
}
export { transformType, transformTokens, clearForm, isNum, getBalance, getWhcBalance, getTokenIds, calculateByte }
