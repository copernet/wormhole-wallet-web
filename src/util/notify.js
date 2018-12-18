/**
 ** @Description: Author Message
 ** @author Rick
 ** @date 2018/9/13
 **/

const popup = {
  warning (message, vm) {
    vm.$q.notify({
      color: 'pink', message, icon: 'warning', position: 'top'
    })
  },
  ok (message, vm, hash, isBch = false) {
    let hashParams = {}
    vm.$q.notify({
      color: 'secondary', message, icon: 'check', position: 'top', timeout: 1000
    })
    if (hash) {
      hashParams = { txHash: hash, isBch }
      return vm.$router.push({ name: 'tradingDetails', params: hashParams })
    }
  }
}

export default popup
