<template lang="pug">
    div.footer-body
        div.footer-container
            div.social-container
                    div(class='select-container')
                        q-btn.standard-btn(@click='faqClick' icon='contact_support' no-caps) {{$t('faq.title')}}
                        //- q-btn(icon-right="expand_more" :label="labelLanguage"  class='select-btn-container' no-caps)
                    //-         q-popover(anchor='bottom left'  self='top left' fit)
                    //-             div(v-for='item in options' class='item-container')
                    //-                 q-item(v-close-overlay @click.native='langClick(item.label,item.value)')
                    //-                     q-item-main {{item.label}}
                    div(class='social-content')
                        a(target='_blank' href='https://twitter.com/WormholeCash' class='social-icon')
                            img(src='../../public/img/twitter-logo.svg')
                        a(target='_blank' href='https://medium.com/@wormholecash' class='social-icon')
                            img(src='../../public/img/medium_black.svg')
                        a(target='_blank' href='https://github.com/copernet' class='social-icon')
                            img(src='../../public/img/github-logo.svg')
                        a(target='_blank' href='https://t.me/joinchat/ExB1tQ-vgIZxFmA749z2nA' class='social-icon')
                            img(src='../../public/img/telegram.svg')
                        a(target='_blank' href='https://wormholetech.slack.com/join/shared_invite/enQtNDU4MTUyODgxMTg2LTEwNDE4NzhiOWVmYTE4MmI0OWMyODA4MWE5ODFkYTJkNzhkMGZlNGYwZTAyYzRmOTc1ZDdlOWE2NWVlNzRlNzY' class='social-icon')
                            img(src='../../public/img/slack.svg')
            div.cr-container
                div
                    img(class='footer-logo')(src='../../public/img/logo_footer.png')
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
    },
    faqClick () {
      this.$router.push('/faq')
    }
  }
}
</script>
<style  lang="scss" scoped>
.footer-body{
    box-sizing: border-box;
    background: #17234c;
    padding: 50px 0;
    width: 100%;
    display: flex;
    justify-content: center;
    .footer-container{
        max-width: 1200px;
        width: 100%;
        .standard-btn{
            display: inline-block;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            height: 40px;
            font-size:18px;
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
        }
        .social-container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .select-container{
                box-sizing: border-box;
                width: 176px;
                height: 68px;
                margin-right: 20px;
                display: flex;
                align-items: center;
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
                box-sizing: border-box;
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
            margin-top: 70px;
            opacity: 0.5;
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
@media screen and (max-width: 480px){
    .footer-body{
        background: #17234c;
        padding: 20px 0;
        width: 100%;
        display: flex;
        justify-content: center;
        .footer-container{
            max-width: 100%;
            width: 100%;
            .standard-btn{
                font-size: 13px;
                margin-left: 10px;
                padding: 0 15px;
            }
            .social-container{
                display: flex;
                justify-content: space-around;
                .select-container{
                    box-sizing: border-box;
                    .select-btn-container{
                        border-radius: 3px;
                        background-image: linear-gradient(294deg, #333e80, #415d95);
                        box-sizing: border-box;
                        width: 100%;
                        height: 100%;
                        font-size: 18px;
                        color: #fff;
                    }
                }
                .social-content{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    .social-icon{
                        width: 30px;
                        height: 30px;
                        // opacity: 0.1;
                        background-color: rgba(255,255,255,0.1);
                        font-weight: 500;
                        display: flex;
                        -webkit-box-pack: center;
                        justify-content: center;
                        border-radius: 100%;
                        margin-right: 6px;
                        // transition: all 0.5s ease 0s;
                        img{
                            width: 13px;
                        }
                        &:hover{
                            background-color: rgba(255,255,255,0.5);
                        }
                    }
                }
            }
            .cr-container{
                text-align: center;
                margin-top: 20px;
                opacity: 0.4;
                color: #fff;
                font-size: 16px;
                letter-spacing: 0.5px;
                font-weight: 900;
                .footer-logo{
                    width: 176px;
                }
                .cr-text{
                    margin-top: 10px;
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

}

.item-container:hover{
    background-color: #eff5ff;
}
.social-container .body{
    display: flex;
    flex-direction: row;
}
</style>
