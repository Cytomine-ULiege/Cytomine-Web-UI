import Vue from 'vue';

import VueRouter from 'vue-router';
import router from './routes.js';

import Notifications from 'vue-notification';

import i18n from './lang.js';

import store from './store.js';

import axios from 'axios';

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

import App from './App.vue';

Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(Buefy);
Vue.config.productionTip = false;

window.axios = axios;

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app');
