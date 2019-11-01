module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  chainWebpack: (config) => {
    // remove the prefetch plugin
    config.plugins.delete('prefetch');
  },
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false,
      lintGQL: true
    }
  }
};
