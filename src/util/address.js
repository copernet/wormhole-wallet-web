/**
 * util for address
 */
import bitcoin from 'bitcore-lib'
import bch from 'bitcore-lib-cash'
export default{
  validateAddress (address) {
    return bitcoin.Address.isValid(address)
  },
  decodeAddressFromPrivateKey (key) {
    //  Return the address decoded from the private key.
    const CashAddrFormat = bch.Address.CashAddrFormat
    const privateKey = new bch.PrivateKey(key)
    const addr = privateKey.toAddress().toString(CashAddrFormat)
    return addr
  },
  encodePrivateKey (key, passphrase) {
    return key
  },
  createAddress () {
    const CashAddrFormat = bch.Address.CashAddrFormat
    const privateKey = new bch.PrivateKey()
    const address = privateKey.toAddress().toString(CashAddrFormat)
    return { hash: address, privkey: privateKey.toWIF() }
  },
  estimateFee () {

  },
  getTransactions (address) {

  },
  genPubkey (privkey) {
    return new bch.PrivateKey(privkey).toPublicKey().toString('hex')
  },
  signMsg (msg, privKey) {
    const Message = bch.Message
    const message = new Message(msg)
    const privateKey = new bch.PrivateKey(privKey)
    const signature = message.sign(privateKey)
    return signature
  },
  validate (address) {
    if (!address) return false
    try {
      new bch.PrivateKey(address).toAddress()
      return true
    } catch (e) {
      return false
    }
  }
}
