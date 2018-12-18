<template lang="pug">
    div.nav-body
        div.nav-container
            div.left-container
                a(href='#/')
                    img.wormhole-logo(src="../../../../public/img/logo_top.png")
            div.right-container
                q-btn.standard-btn(@click='loginClick' no-caps) {{$t('account.login')}}
                q-btn.standard-btn(@click='signClick' no-caps) {{$t('account.signUp')}}
</template>
<script>
export default{
  methods: {
    loginClick () {
      this.$router.push('/login')
    },
    signClick () {
      this.$router.push('/signup')
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
            .beta{
                color:red;
                font-size: 10px;
                background-color: grey;
                padding: 0px;
                display: inline-block;
                line-height: 0;
                margin-left: 5px;
            }
        }
        .right-container{
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
</style>
