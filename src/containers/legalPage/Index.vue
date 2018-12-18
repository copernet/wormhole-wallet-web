<template lang="pug">
    div
        index-header
        q-layout(class='legal-page-body')
            q-page-container(class='content-container')
                div.content-inner
                    transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in")
                        keep-alive
                            router-view
        index-footer
</template>
<script>
import IndexHeader from '../../components/Header'
import IndexFooter from '../../components/Footer'
export default {
  components: { IndexHeader, IndexFooter },
  data () {
    return {
      autoMill: 3000
    }
  },
  created () {
    window.scrollTo(0, 0)
  },
  methods: {
    create () {
      this.$router.push('/signup')
    }
  }
}
</script>
<style  lang="scss" scoped>
.legal-page-body{
  .content-container{
    max-width: 100%;
    width:100%;
    display: flex;
    justify-content: center;
    .content-inner{
      display: flex;
      width:100%;
      max-width: 1200px;
      padding: 40px 0;
    }
  }
}
@media screen and (max-width: 480px) {

}
</style>
