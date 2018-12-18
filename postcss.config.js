module.exports = {
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
