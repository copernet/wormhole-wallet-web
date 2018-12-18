<template lang="pug">
    div.tip-container
        span(:class="{red: isRed}") {{currency}} Balance: {{balance}} {{isRed ? description : ''}}
</template>

<script>
export default {
  props: ['balance', 'currency', 'description', 'factorage', 'noRed'],
  computed: {
    isRed: vm => {
      if (vm.noRed) {
        return false
      }
      if (vm.factorage && vm.factorage === 'WHC') {
        if (vm.balance && parseFloat(vm.balance) < 1) {
          return true
        }
      }
      if (vm.balance && parseFloat(vm.balance) >= 0) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
    .tip-container {
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        span {
            font-size: 14px;
        }
        .red {
            color: #db2828;
        }
    }
</style>
