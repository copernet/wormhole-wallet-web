<template lang="pug">
    div.faq-container
        div.content-container
          div.item
            div.title {{$t('faq.one.que')}}
            div.desc  {{$t('faq.one.ans')}}
          div.item
            div.title {{$t('faq.two.que')}}
            div.desc  {{$t('faq.two.ans')}}
          div.item
            div.title {{$t('faq.three.que')}}
            div.desc {{$t('faq.three.ans')}}
          div.item
            div.title {{$t('faq.four.que')}}
            div.desc {{$t('faq.four.ans')}}
          div.item
            div.title {{$t('faq.five.que')}}
            div.desc {{$t('faq.five.ans')}}
          div.item
            div.title {{$t('faq.six.que')}}
            div.desc {{$t('faq.six.ans')}}
          div.item
            div.title {{$t('faq.seven.que')}}
            div.desc {{$t('faq.seven.ans')}}
          div.item
            div.title {{$t('faq.eight.que')}}
            div.desc {{$t('faq.eight.ans')}}
          div.item
            div.title {{$t('faq.nine.que')}}
            div.desc {{$t('faq.nine.ans')}}
          div.item
            div.title {{$t('faq.ten.que')}}
            div.desc {{$t('faq.ten.ans')}}
          div.item
            div.title {{$t('faq.eleven.que')}}
            div.desc {{$t('faq.eleven.ans')}}
</template>
<script>
import IndexHeader from '../../components/Header'
import IndexFooter from '../../components/Footer'
export default {
  components: { IndexHeader, IndexFooter },
  data () {
    return {

    }
  },
  methods: {
  },
  mounted () {
    window.scrollTo(0, 0)
  }
}
</script>
<style  lang="scss" scoped>
.faq-container{
  box-sizing: border-box;
  width: 100%;
  word-wrap:break-word;
  .content-container{
    .item{
      margin-bottom: 30px;
      line-height: 1.5;
      .title{
        font-weight: 600;
        font-size: 20px;
      }
      .desc{
        margin-top: 10px;
      }
    }
  }
}
@media screen and (max-width: 480px) {
.faq-container{
  padding: 20px;
}
}
</style>
