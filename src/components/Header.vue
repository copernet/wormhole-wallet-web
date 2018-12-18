<template lang="pug">
    div.nav-body
        div.nav-container
            div.left-container
                a(href='#/')
                    img.wormhole-logo(src="../../public/img/logo_top.png")
            div.right-container
                div(class='select-container')
                        q-btn(icon-right="expand_more" :label="labelLanguage"  class='standard-btn' no-caps)
                            q-popover(anchor='bottom left'  self='top left' fit)
                                div(v-for='item in options' class='item-container')
                                    q-item(v-close-overlay @click.native='langClick(item.label,item.value)')
                                        q-item-main {{item.label}}
                q-btn.standard-btn(@click='loginClick' no-caps) {{$t('account.login')}}
                q-btn.standard-btn(@click='signClick' no-caps v-if='isCanSignup') {{$t('account.signUp')}}
</template>
<script>
export default{
  data () {
    return {
      isCanSignup: true,
      options: [
        {
          label: 'English',
          value: 'en'
        },
        {
          label: '中文(简体)',
          value: 'zh'
        }
      ]
    }
  },
  computed: {
    labelLanguage () {
      return this.$i18n.locale === 'en' ? 'English' : '中文(简体)'
    }
  },
  methods: {
    loginClick () {
      this.$router.push('/login')
    },
    signClick () {
      this.$router.push('/signup')
    },
    langClick (label, value) {
      localStorage.setItem('lang', value)
      this.$i18n.locale = value
    }
  }
}
</script>
<style  lang="scss" scoped>
.nav-body{
    width:100%;
    display: flex;
    justify-content: center;
    background: #1a2a5f;
    .nav-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
        max-width: 1200px;
        height:72px;
        min-height: 32px;
        .left-container{
            .wormhole-logo{
                width: 276px;
            }
        }
        .right-container{
            display: flex;
        }
        .standard-btn{
            display: inline-block;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            height: 40px;
            font-size:15px;
            color: white;
            background-color: rgba(255, 255, 255, 0.1);
            line-height: 2.5rem;
            outline: none;
            transition: all 0.3s ease 0s;
            flex: 0 0 auto;
            border-radius: 2px;
            padding: 0px 20px;
            border-width: initial;
            border-style: initial;
            border-color: transparent;
            border-image: initial;
            margin-left: 8px;
        }
    }
}
@media screen and (max-width: 480px){
    .nav-body{
        display: flex;
        justify-content: center;
        background: #1a2a5f;
        padding: 0 2px 0;
        .nav-container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width:100%;
            max-width: 100%;
            min-height: 32px;
            flex-wrap: wrap;
            .left-container{
                .wormhole-logo{
                    width: 173px;
                }
            }
            .right-container{
            }
            .standard-btn{
                display: inline-block;
                font-weight: 600;
                text-align: center;
                cursor: pointer;
                height: 20px;
                font-size:12px;
                color: white;
                background-color: rgba(255, 255, 255, 0.1);
                line-height: 20px;
                outline: none;
                transition: all 0.3s ease 0s;
                flex: 0 0 auto;
                border-radius: 2px;
                padding: 0px 10px;
                border-color: transparent;
                border-image: initial;
                margin-left: 8px;
            }
        }
    }

}

</style>
