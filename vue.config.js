var config = {
  pluginOptions: {
    quasar: {
      theme: 'mat',
      rtlSupport: true,
      importAll: true
    }
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar-framework[\\\/]/
  ],
  devServer: {
    proxy: process.env.GLOBAL_PROXY
  },
  baseUrl: process.env.GLOBAL_BASE_URL,
  configureWebpack: {
    // plugins: [
    //   new CompressionWebpackPlugin({
    //     algorithm: 'gzip',
    //     test: /\.js(\?.*)?$/i,
    //     compressionOptions: { level: 1 }
    //   })
    // ],
    externals: {
      // vue: 'Vue',
      // vuex: 'Vuex',
      // 'vue-router': 'VueRouter'
    }
  }
}

module.exports = config
