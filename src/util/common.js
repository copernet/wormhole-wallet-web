/**
 * util for common things
 */
export default {
  generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
    })
    return uuid
  },
  verifyUUID (uuid) {
    // Check UUID for proper format
    let verify = uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89a-f][0-9a-f]{3}-[0-9a-f]{12}$/i) || []
    // Return false if it fails, true if its valid structure
    return verify.length !== 0
  },
  validateEmail (email) {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
  },
  validatePassword (password) {
    /**
      at least 8 length and must have three types of UpperCase/LowerCase/Numbers/Symbols
     */
    let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/
    return reg.test(password)
  },
  generateQsArrayString (key, array) {
    if (Array.isArray(array)) {
      if (array.length > 1) {
        var initStr = ''
        array.forEach(function (i) {
          initStr += ('&' + key + '=' + i)
        })
        initStr = initStr.substr(1)
        return initStr
      } else if (array.length === 1) {
        return key + '=' + array[0]
      }
      return ''
    }
    return ''
  },
  validateNumber (str) {
    let index = str.indexOf('.')
    let lastIndex = str.lastIndexOf('.')
    if (index !== -1 && lastIndex !== -1 && index === lastIndex) {
      return str
    }
    if (index !== -1) {
      str = str.substring(0, index + 1)
    }
    str = str.replace(/[^\d]/g, '')
    return str
  },
  /**
   * transfer wallet object to address array
   * @param {*} wallet wallet object
   */
  transferWalletToAddArr (wallet) {
    let addresses = wallet.addresses
    let addressArr = []
    addresses.forEach(item => {
      addressArr.push(item.address)
    })
    return addressArr
  },
  transferToAddressArr (addresses) {
    let arr = []
    if (Array.isArray) {
      addresses.forEach(element => {
        arr.push(element.address)
      })
    }
    return arr
  },
  removeDuplicates (originalArray, prop) {
    var newArray = []
    var lookupObject = {}

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i]
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i])
    }
    return newArray
  }
}
