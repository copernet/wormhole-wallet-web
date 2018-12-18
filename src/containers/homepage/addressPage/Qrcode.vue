<template lang="pug">
    q-modal(v-model="isOpen" minimized ref="modalRef"  @hide='hideF')
        //- div(style="padding: 50px")
        //-     div(class="q-display-1 q-mb-md")
        //-     p {{pubAddress}}
        //-     q-btn(color="red" label="Close" @click='close')
        div(class='container')
          img(:src='imgSrc')
</template>
<script>

export default {
  data () {
    return {

    }
  },
  computed: {
    imgSrc () {
      return 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&=UTF-8&chl=' + this.pubAddress
    }
  },
  props: [ 'isOpen', 'pubAddress' ],
  methods: {
    hideF () {
      this.$emit('qrHideEmit')
    },
    close () {
      this.$emit('qrHideEmit')
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
