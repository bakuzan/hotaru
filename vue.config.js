module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/hotaru/' : '/',
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false
    }
  }
};
