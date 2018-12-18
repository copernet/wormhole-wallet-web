import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
// import './registerServiceWorker'

import './styles/quasar.styl'
import 'quasar-framework/dist/quasar.ie.polyfills'
import 'quasar-extras/animate'
import 'quasar-extras/material-icons'
import Quasar from 'quasar'
import VueI18n from 'vue-i18n'
import Vuelidate from 'vuelidate'
import VueAnalytics from 'vue-analytics'
import messages from './message'
import IdleVue from 'idle-vue'
import VueNativeSock from 'vue-native-websocket'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueAnalytics, {
  id: 'UA-109491748-2',
  router
})
Vue.use(VueI18n)
Vue.use(Vuelidate)
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.use(Quasar, {
  config: {}
})
const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 1000 * 60 * 10// 10 minutes
})
Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'en',
  messages
})
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// clear cache
caches.keys().then((names) => {
  for (let name of names) {
    caches.delete(name)
  }
})
navigator.serviceWorker.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})

caches.keys().then((names) => {
  for (let name of names) {
    caches.delete(name)
  }
})
// Hot updates
if (module.hot) {
  module.hot.accept(['./message/en', './message/zh'], function () {
    i18n.setLocaleMessage('en', require('./message/en').default)
    i18n.setLocaleMessage('zh', require('./message/zh').default)
    // Or the following hot updates via $i18n property
    // app.$i18n.setLocaleMessage('en', require('./en').default)
    // app.$i18n.setLocaleMessage('ja', require('./ja').default)
  })
}
const lan = navigator.language || navigator.browserLanguage || 'en'
if (localStorage.getItem('lang')) {
  i18n.locale = localStorage.getItem('lang')
} else {
  if (lan === 'zh' || lan === 'zh-CN' || lan === 'zh-TW') {
    i18n.locale = 'zh'
  } else {
    i18n.locale = 'en'
  }
}
Vue.use(VueNativeSock, process.env.VUE_APP_WEBSOCKET_URL, {
  store: store,
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 30, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 2000,
  format: 'json',
  passToStoreHandler: function (eventName, event, next) {
    next(eventName, event)
  }
})
