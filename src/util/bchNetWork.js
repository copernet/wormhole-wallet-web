/**
** @Description: Author Message
** @author Rick
** @date 2018/9/18
**/
let bchaddr = require('bchaddrjs')
// judge bch address
const isBCHCashAddress = (address) => {
  if (address === null || address === '' || address === undefined) {
    return ''
  }
  if (address.indexOf('bitcoincash') !== -1 || address.indexOf('bchtest') !== -1 || address.indexOf('bchreg') !== -1) {
    const selfAddress = address.split(':')[1]
    return bchaddr.isCashAddress(selfAddress)
  } else {
    const selfAddress = address.substr(0, 1)
    if (selfAddress === 'q') {
      return bchaddr.isCashAddress(address)
    } else {
      return bchaddr.isLegacyAddress(address)
    }
  }
}

export { isBCHCashAddress }
