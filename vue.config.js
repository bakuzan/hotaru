module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/hotaru/' : '/',
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
