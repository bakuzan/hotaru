import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import { createProvider } from './vue-apollo';

import PortalVue from 'portal-vue';

Vue.config.productionTip = false;
Vue.use(PortalVue);

new Vue({
  router,
  provide: createProvider().provide(),
  render: (h) => h(App)
}).$mount('#app');
