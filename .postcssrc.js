// const plugins = [
//   require('autoprefixer')
// ]
//
// if (process.env.QUASAR_RTL) {
//   plugins.push(
//     require('postcss-rtl')({})
//   )
// }
//
// module.exports = {
//   plugins
// }

const plugins = {
  'plugins': {
    'postcss-import': {},
    'postcss-url': {},
    // to edit target browsers: use 'browserslist' field in package.json
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propWhiteList: [],
      propBlackList: [],
      selectorBlackList: [],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }
  }
}

if (process.env.QUASAR_RTL) {
  plugins.plugins['postcss-rtl'] = {}
}

module.exports = plugins
