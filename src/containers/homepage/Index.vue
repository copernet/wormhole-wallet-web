<template lang="pug">
    q-layout(class='home-page-body')
        q-layout-header(class='homepage-title-container')
            q-toolbar(class='nav-container')
                div
                    a(href='#/home')
                        img.wormhole-logo(src="../../../public/img/logo_top.png")
                div
                    q-btn(icon-right="expand_more" :label="labelLanguage"  class='select-btn-container' no-caps)
                        q-popover(anchor='bottom left'  self='top left' fit)
                            div(v-for='item in options' class='item-container')
                                q-item(v-close-overlay @click.native='langClick(item.label,item.value)')
                                    q-item-main {{item.label}}
                    q-btn(icon-right="expand_more" :label="labelNet"  class='select-btn-container' no-caps)
                            q-popover(anchor='bottom left'  self='top left' fit)
                                div(v-for='item in netOptions' class='item-container')
                                    q-item(v-close-overlay @click.native='netClick(item.net)')
                                        q-item-main.item-text {{item.net}}
                    q-btn.sign-out(@click="signOut" no-caps) {{$t('account.signOut')}}
        q-layout-drawer(
            side="left"
            v-model="left"
            class='home-drawer-container'
        )
            q-scroll-area(class="fit")
                div(v-for="side in sideList")
                    SideBar(:sideType="side")
        q-page-container(class='content-container')
            transition(enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in")
                keep-alive
                    router-view
        q-layout-footer(class='homepage-footer-container')
            div.social-container
                div(class='body')
                    div(class='select-container')
                        q-btn.standard-btn(@click='faqClick' icon='contact_support' no-caps) {{$t('faq.title')}}
                div(class='social-content')
                    a(target='_blank' href='https://twitter.com/WormholeCash' class='social-icon')
                        img(src='../../../public/img/twitter-logo.svg')
                    a(target='_blank' href='https://medium.com/@wormholecash' class='social-icon')
                        img(src='../../../public/img/medium_black.svg')
                    a(target='_blank' href='https://github.com/copernet' class='social-icon')
                        img(src='../../../public/img/github-logo.svg')
                    a(target='_blank' href='https://t.me/joinchat/ExB1tQ-vgIZxFmA749z2nA' class='social-icon')
                        img(src='../../../public/img/telegram.svg')
                    a(target='_blank' href='https://wormholetech.slack.com/join/shared_invite/enQtNDU4MTUyODgxMTg2LTEwNDE4NzhiOWVmYTE4MmI0OWMyODA4MWE5ODFkYTJkNzhkMGZlNGYwZTAyYzRmOTc1ZDdlOWE2NWVlNzRlNzY' class='social-icon')
                        img(src='../../../public/img/slack.svg')
</template>
<script>
import QItemTile from 'quasar-framework/src/components/list/QItemTile'
import QIcon from 'quasar-framework/src/components/icon/QIcon'
import SideBar from './partials/SideBar'
import { createNamespacedHelpers } from 'vuex'
import bch from 'bitcoincashjs'
const { mapActions } = createNamespacedHelpers('accountModule')
export default {
  data () {
    return {
      left: true,
      sideList: [{ name: 'homePage.menu.myaddress', icon: 'attach_money' }, { name: 'homePage.menu.explorer', icon: 'explore' }, { name: 'homePage.menu.setting', icon: 'menu' }],
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
      ]
    }
  },
  components: { QIcon, QItemTile, SideBar },
  computed: {
    labelNet () {
      if (bch.Networks.defaultNetwork === bch.Networks.testnet) {
        return 'Testnet'
      } else {
        return 'Mainnet'
      }
    },
    netOptions () {
      if (bch.Networks.defaultNetwork === bch.Networks.testnet) {
        return [{ net: 'Mainnet' }]
      } else {
        return [{ net: 'Testnet' }]
      }
    },
    labelLanguage () {
      return this.$i18n.locale === 'en' ? 'English' : '中文(简体)'
    }
  },
  methods: {
    ...mapActions(['account_logout']),
    signOut () {
      this.account_logout()
    //   this.$router.push('/login')
    },
    langClick (label, value) {
      localStorage.setItem('lang', value)
      this.$i18n.locale = value
    },
    netClick (net) {
      if (net === 'Testnet') {
        window.open('https://testnet.wormhole.cash/home/index.html')
      } else {
        window.open('https://wallet.wormhole.cash')
      }
    },
    faqClick () {
      this.$router.push('/faq')
    },
    getLang () {
      let lang = localStorage.getItem('lang') || 'en'
      this.$i18n.locale = lang
    }
  },
  onIdle () {
    this.account_logout()
  }

}
</script>

<style lang="scss">
.home-page-body .q-layout-drawer {
    bottom: 0px!important;
}
.home-page-body{
    .homepage-title-container{
        position: fixed;
    }
    .q-scrollarea{
    }
    .wormhole-logo {
      height: 36px;
    }
    .register-btn {
      margin: 10px;
    }
    .sign-out {
        cursor: pointer;
        font-weight: 900;
        background: rgba(180,168,255,.1)
    }
    .dash-header {
        display: flex;
        align-items: center;
        color: rgb(117, 118, 121);
        font-size: 18px;
        height:50px;
        .dash-icon {
            margin-right: 10px;
        }
    }
    .nav-container{
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #17244f!important;
        padding: 0 25px;
    }
    .line{
        box-sizing: border-box;
        height: 1px;
        background-color: rgb(204, 204, 204);
        margin: 0px 10px;
    }
    .home-drawer-container{
        .fit{
        background-color: rgba(201,206,214,.2);
        padding-top: 40px;
        }
    }
    .content-container .container{
        padding: 20px;
    }
    .bottom-container{
        position: fixed;
        width: 100%;
        bottom: 50px;
        box-sizing: border-box;
        padding: 0 20px 0 25px;
        display: flex;
        flex-direction: row;
    }
    .homepage-footer-container{
        background: #17234c;
        padding: 10px 20px 10px 50px;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .select-container{
        flex: 1;
        box-sizing: border-box;
        width: 16px;
        height: 50px;
        margin-right: 20px;
        .select-btn-container{
        border-radius: 3px;
        background-color:rgba(201,206,214,.2);
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        font-size: 15px;
        color: #8a94a6;
        .q-btn-inner{
            padding: 0px 0px;
            div{
                max-width: 59px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .q-btn{
            padding: 0px;
        }
      }
    }

    [dir] .q-item.active, [dir] .q-item.router-link-active, [dir] .q-item:focus {
        background: transparent;
    }
    .home-drawer-container{
        width: 100%;
    }
    .social-container{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
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
    .q-layout-drawer{
        position: fixed;
        top:0!important;
    }
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
            .q-btn-inner{
                padding: 0 20px;
            }
    }
}

.item-container:hover{
    background-color: #eff5ff;
}
.select-container .q-btn{
    padding: 0px;
}

</style>
