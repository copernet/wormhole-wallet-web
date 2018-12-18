<template lang="pug">
    div.footer-body
        div.footer-container
            div.social-container
                div(class='body')
                    //- q-select(v-model="select" :options="options" hide-underline @input='select_input')
                    div(class='select-container')
                        q-btn(icon-right="expand_more" :label="labelLanguage"  class='select-btn-container' no-caps)
                            q-popover(anchor='bottom left'  self='top left' fit)
                                div(v-for='item in options' class='item-container')
                                    q-item(v-close-overlay @click.native='langClick(item.label,item.value)')
                                        q-item-main {{item.label}}
                    //- div(class='select-container')
                    //-     q-btn(icon-right="expand_more" :label="labelNet"  class='select-btn-container' no-caps)
                    //-         q-popover(anchor='bottom left'  self='top left' fit)
                    //-             div(v-for='item in netOptions' class='item-container')
                    //-                 q-item(v-close-overlay @click.native='netClick(item.net)')
                    //-                     q-item-main.item-text {{item.net}}
                div(class='social-content')
                    a(target='_blank' href='https://twitter.com/WormholeCash' class='social-icon')
                        img(src='../../../../public/img/twitter-logo.svg')
                    a(target='_blank' href='https://medium.com/@wormholecash' class='social-icon')
                        img(src='../../../../public/img/medium.svg')
                    a(target='_blank' href='https://github.com/copernet' class='social-icon')
                        img(src='../../../../public/img/github-logo.svg')
            div.cr-container
                div
                    img(class='footer-logo')(src='../../../../public/img/logo_footer.png')
                div(class='cr-text') © 2018 wallet.wormhole.cash
</template>
<script>
export default{
  data () {
    return {
      select: 'en',
      options: [
        {
          label: 'English',
          value: 'en'
        },
        {
          label: '中文(简体)',
          value: 'zh'
        }
      ],
      netOptions: [
        {
          net: 'Testnet'
        },
        {
          net: 'Mainnet'
        }
      ],
      labelLanguage: 'English',
      labelNet: 'Testnet'
    }
  },
  methods: {
    select_input (value) {
      this.$i18n.locale = value
    },
    langClick (label, value) {
      this.labelLanguage = label
      this.$i18n.locale = value
    },
    netClick (net) {
      this.labelNet = net
    }
  }
}
</script>
<style  lang="scss" scoped>
.footer-body{
    background: #17234c;
    padding: 50px 0;
    width: 100%;
    display: flex;
    justify-content: center;
    .footer-container{
        max-width: 1200px;
        width: 100%;
        .social-container{
            display: flex;
            justify-content: space-between;
            .select-container{
                box-sizing: border-box;
                width: 176px;
                height: 68px;
                margin-right: 20px;
                .select-btn-container{
                    border-radius: 3px;
                    background-image: linear-gradient(294deg, #333e80, #415d95);
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    font-size: 20px;
                    color: #fff;
                }
            }
            .social-content{
                display: flex;
                flex-direction: row;
                .social-icon{
                    width: 60px;
                    height: 60px;
                    // opacity: 0.1;
                    background-color: rgba(255,255,255,0.1);
                    font-weight: 500;
                    display: flex;
                    margin-right: 12px;
                    -webkit-box-pack: center;
                    justify-content: center;
                    border-radius: 100%;
                    // transition: all 0.5s ease 0s;
                    img{
                        width: 25px;
                    }
                    &:hover{
                    background-color: rgba(255,255,255,0.5);
                    }
                }
            }
        }
        .cr-container{
            text-align: center;
            margin-top: 100px;
            opacity: 0.4;
            color: #fff;
            font-size: 16px;
            letter-spacing: 0.5px;
            font-weight: 900;
            .footer-logo{
                width: 276px;
            }
            .cr-text{
                margin-top: 26px;
            }
        }
        .item-container{
            .item-text{
                height: 22px;
                font-size: 16px;
            }
        }
    }

}
.item-container:hover{
    background-color: #eff5ff;
}
.social-container .body{
    display: flex;
    flex-direction: row;
}
</style>
