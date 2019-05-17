import './registerServiceWorker';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { createProvider } from './vue-apollo';

import PortalVue from 'portal-vue';
import Meta from 'vue-meta';

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.use(PortalVue);
Vue.use(Meta);

new Vue({
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App)
}).$mount('#app');
