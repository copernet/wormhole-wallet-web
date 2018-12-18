<template lang="pug">
    div 123
</template>
<script>
import IndexHeader from './partials/Header'
import IndexFooter from './partials/Footer'
export default {
  components: { IndexHeader, IndexFooter },
  data () {
    return {
      autoMill: 3000,
      isWeb: true
    }
  },
  methods: {
    create () {
      window.open('https://wallet.wormhole.cash/androidApk/wormhole_wallet.apk', '_self')
    }
  },
  mounted () {
    let width = window.innerWidth
    if (width <= 480) {
      this.isWeb = false
    }
  }
}
</script>
<style  lang="scss" scoped>
.content-body{
    display: flex;
    width: 100%;
    justify-content: center;
    .download-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 180px;
        margin-top: 23px;
        .android-img-box {
            .android-img {
                width: 280px;
                cursor: pointer;
            }
        }
        .code-box {
            .code {
                width: 180px;
                height: 180px;
            }
        }
    }
    .phone-box {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .content-container{
        display: flex;
        max-width: 1200px;
        flex-direction: row;
        justify-content: center;
        .left-container{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color:white;
            padding-right: 20px;
            line-height: 2;
            .title{
                color: #fff;
                font-size: 50px;
                font-weight: 900;
            }
            .desc{
                color: #fff;
                font-size: 24px;

            }
            .create-btn{
                width: 250px;
                padding: 15px 30px;
                background-image: linear-gradient(258deg, #5ba7ff, #624ae8);
                margin-top: 30px;
                font-weight: 800;
            }
        }
        .right-container{
            flex:1;
            .whc-connect{
                width: 464px;
            }
            .wallet-icon{
                width: 475px;
            }
        }
    }
    .content-container.first{
        padding: 0px 0;
    }
    .content-container.second{
        padding: 100px 50px;
        .left-container{
            color: black;
            padding-left: 30px;
        }
        .title{
            font-size: 48px;
            font-weight: 900;
            color: #182c4f;
        }
        .desc{
            color: #8a94a6;
            font-size: 24px;
            line-height: 1.5;
            letter-spacing: normal;
        }
    }
    .content-container.third{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .title{
            font-size: 54px;
            font-weight: 900;
            color: #182c4f;
            width: 670px;
        }
        .desc{
            font-size: 24px;
            color: #8a94a6;
            width: 650px;
            text-align: center;
            margin-top: 36px;
            margin-bottom: 68px;
        }
    }
    .line{
        width:66px;
        height: 3px;
        background: #182c4f;
        margin-top: 40px;
        margin-bottom: 16px;
    }
}
.content-body.first{
    background: linear-gradient(to bottom, #1a2a5f, #162146);
}
.content-body.second{
    background:white;
}
.slide-body{
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 18px 18px 0 rgba(10, 31, 68, 0.12), 0 0 1px 0 rgba(10, 31, 68, 0.1);
    background-color: #ffffff;
    width: 800px;
    height:400px;
    margin-bottom: 160px;
    .slide-container{
        display: flex;
        flex-direction: row;
        .left{
            display: flex;
            flex-direction: column;
            flex: 1;
            .title-container{
                display: flex;
                flex-direction: row;
                align-items: center;
                .right-icon{
                    display: inline-block;
                    width: 36px;
                    height:27px;
                    background-image: url('../../../public/img/icon_right.png');
                    background-size: cover;
                }
                .title-text{
                    color: #182c4f;
                    font-size: 36px;
                    font-weight: 900;
                    margin-left: 16px;
                }
            }
            .desc-container{
                color: #a6aebc;
                font-size: 20px;
                margin-top: 35px;
            }
        }
        .right{
            width: 225px;
        }
        .slide-icon{
            width: 100%;
        }
        .slide-icon.special{
            width: 183px;
            margin-left:15px;
        }
    }
}
@media screen and (max-width: 480px) {
    .content-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap-reverse;
        .left-container{
            padding-right: 0px!important;
            width: 100vw;
            text-align: center;
            .title{
                font-size: 25px!important;
                font-weight: 900;
            }
            .desc{
                color: #fff;
                font-size: 16px!important;
            }
        }
        .right-container{
            width: 100vw!important;
            .whc-connect{
                width: 100vw!important;
            }
        }
    }
    .content-body {
        .download-box {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            height: 180px;
            margin-top: 23px;
            .android-img-box {
                .android-img {
                    width: 170px;
                    cursor: pointer;
                }
            }
            .code-box {
                .code {
                    width: 150px;
                    height: 150px;
                }
            }
        }
        .content-container.second {
            padding: 60px 30px;
            .left-container{
                color: black;
                padding-left: 0px;
            }
            .title{
                font-size: 25px!important;
                font-weight: 900;
                color: #182c4f;
                text-align:left;
                .line {
                    margin-top: 15px;
                }
            }
            .desc{
                font-size: 15px!important;
                text-align:left;
            }
            .right-container{
                .wallet-icon{
                    width: 90vw;
                }
            }
        }
        .content-container.third {
            justify-content: center;
            .title{
                font-size: 25px;
                font-weight: 900;
                width: 100vw;
                text-align: left;
                padding-left: 30px;
            }
            .desc{
                font-size: 15px;
                width: 100vw;
                padding-left: 30px;
                text-align: left;
                margin-top: 16px;
                margin-bottom: 68px;
            }
        }
    }
    .slide-body{
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 18px 18px 0 rgba(10, 31, 68, 0.12), 0 0 1px 0 rgba(10, 31, 68, 0.1);
        background-color: #ffffff;
        width: 90vw;
        height: 240px;
        margin-bottom: 60px;
        .slide-container{
            display: flex;
            flex-direction: row;
            padding: 15px;
            .left{
                display: flex;
                flex-direction: column;
                flex: 1;
                .title-container{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .right-icon{
                        display: inline-block;
                        width: 36px;
                        height:27px;
                        background-image: url('../../../public/img/icon_right.png');
                        background-size: cover;
                    }
                    .title-text{
                        color: #182c4f;
                        font-size: 15px;
                        font-weight: 900;
                        margin-left: 16px;
                    }
                }
                .desc-container{
                    color: #a6aebc;
                    font-size: 15px;
                    margin-top: 15px;
                    text-align: left;
                }
            }
            .right{
                width: 100px;
                display: none;
            }
            .slide-icon{
                width: 100%;
            }
            .slide-icon.special{
                width: 100px;
                margin-left:15px;
            }
        }
    }
}
</style>
