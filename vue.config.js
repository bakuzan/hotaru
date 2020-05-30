module.exports = {
  publicPath:
    process.env.NODE_ENV === 'development' ? '/' : process.env.BASE_URL,
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
