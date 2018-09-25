module.exports = {
  baseUrl: '/',
  assetsDir: 'static',
  chainWebpack: (config) => {
    // remove the prefetch plugin
    config.plugins.delete('prefetch');
  },
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false
    }
  }
};
