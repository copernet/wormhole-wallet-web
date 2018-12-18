import { Big } from 'big.js'
import request from './request'
import popup from './notify'
import commonUtil from './common'
const bch = require('bitcore-lib-cash')
// const SATOSHI_UNIT = new Big(100000000)

// create bch transaction
function transaction (txType, fromAddress, minerFee, txData) {
  var TransactionModel = function (txType, fromAddress, minerFee, txData) {
    var self = this
    self.configure = function (type, address, fee, data) {
      self.type = type
      if (address.privkey) {
        self.privKe = address.privkey
        // self.pubKey = new bch.PrivateKey(address.privkey).toPublicKey().toString()
        self.offline = false
      } else if (address.pubkey) {
        self.pubKey = address.pubkey.toUpperCase()
        self.offline = true
      } else {
        return false
      }

      self.address = address
      self.data = data
      // self.data['pubkey'] = self.pubKey
      self.data['fee'] = fee.valueOf()
      self.data['transaction_from'] = self.address.address
      self.totalCost = fee // TODO: calculate protocol cost
    }

    self.configure(txType, fromAddress, minerFee, txData)
  }

  return new TransactionModel(txType, fromAddress, minerFee, txData)
}

// get unsigned transaction

function getUnsignedTransaction (type, data) {
  let url
  if (type === 'assemble') { // BCH send
    let addressStr = commonUtil.generateQsArrayString('address[]', data.address)
    let amountStr = commonUtil.generateQsArrayString('amount[]', data.amount)
    let fromStr = `transaction_from=${data.transaction_from}`
    let feeStr = `fee=${data.fee}`
    let params = `${addressStr}&${amountStr}&${fromStr}&${feeStr}`
    if ('redeem_address' in data) {
      let redeemStr = `redeem_address=${data.redeem_address}`
      params = `${params}&${redeemStr}`
    }
    url = '/bch/assemble'
    return request.transaction_unsigin_bch(url, params)
  } else {
    url = '/getunsigned/' + type
    return request.transaction_unsigin(url, data)
  }
}

// sign transaction
function prepareTransaction (unsignedTransactionHex, scriptPair, privatekey) {
  let transaction = bch.Transaction(unsignedTransactionHex)
  if (transaction.inputs.length === 0) {
    return false
  }
  let newInputs = transaction.inputs
  transaction.inputs = []
  newInputs.forEach(function (input, index) {
    let s = new Big(scriptPair[index]['value'])
    let inpututxo = {
      'txId': input.prevTxId.toString('hex'),
      'outputIndex': input.outputIndex,
      'script': scriptPair[index]['scriptPubKey'],
      'satoshis': parseFloat(s.times(100000000).valueOf())
    }
    transaction._fromNonP2SH(inpututxo)
  })
  return transaction.sign(privatekey)
}

// push Transaction
function pushSignedTransaction (signTransaction, type) {
  let transactionStr = signTransaction.toString()
  let data = {
    signedTx: transactionStr
  }
  return request.transaction_pushtx(data, type)
}

// confirm Transaction
function confirm (vm, loadingOptions, transaction, route = false, refresh = false) {
  let { warning, ok } = popup
  vm.$q.dialog({ title: vm.$t('homePage.confirm.title'), message: '', color: 'light', ok: vm.$t('homePage.confirm.ok'), cancel: vm.$t('homePage.confirm.cancel') }).then(() => {
    if (!transaction) {
      return warning('Transaction needs an Address with private or public key', vm)
    }
    vm.$q.loading.show(loadingOptions)
    getUnsignedTransaction(transaction.type, transaction.data)
      .then((data) => {
        if (data.code === 0) {
          let result = data.result
          let signTrans = prepareTransaction(result.unsigned_tx, result.sign_data, transaction.privKe)
          // alert not enough money
          if (!signTrans) {
            warning('Error: Not enough inputs in the address!', vm)
          }
          if (!transaction.offline) {
            pushSignedTransaction(signTrans, transaction.type).then((data) => {
              vm.$q.loading.hide()
              vm.cancel && vm.cancel()
              if (data.code === 0) {
                if (data.result.txhash) {
                  ok(vm.$t('homePage.success'), vm, data.result.txhash)
                }
                if (data.result.txHash) {
                  ok(vm.$t('homePage.success'), vm, data.result.txHash, true)
                }
                if (route) {
                  vm.$router.push(route)
                }
              } else {
                warning(data.message, vm)
              }
            }).catch((error) => {
              vm.$q.loading.hide()
              warning(error, vm)
            })
          }
        } else {
          vm.$q.loading.hide()
          warning(data.message, vm)
        }
      })
      .catch((error) => {
        vm.$q.loading.hide()
        warning(error, vm)
      }).catch(() => {})
  })
}

export { transaction, getUnsignedTransaction, prepareTransaction, pushSignedTransaction, confirm }
