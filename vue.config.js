module.exports = {
  publicPath: './',
  assetsDir: 'resources',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: false
    }
  }
}
