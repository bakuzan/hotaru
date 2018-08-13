import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import { createProvider } from './vue-apollo';

import './styles/themes.scss';

Vue.config.productionTip = false;

new Vue({
  router,
  provide: createProvider().provide(),
  render: (h) => h(App)
}).$mount('#app');
