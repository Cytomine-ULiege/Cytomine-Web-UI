import Vue from "vue";

import VueRouter from "vue-router";
import router from "./routes.js";

import Notifications from "vue-notification";

import i18n from "./lang.js";

import store from "./store/store.js";

import {Cytomine} from "cytomine-client";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import VueMoment from "vue-moment";

import VueShortKey from "vue-shortkey";

import * as vClickOutside from "v-click-outside-x";

import App from "./App.vue";

Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(Buefy, {defaultIconPack: "fa"});
Vue.use(VueMoment);
Vue.use(VueShortKey, { prevent: ["input", "textarea"] });
Vue.use(vClickOutside);
Vue.config.productionTip = false;

new Cytomine("localhost-core");

new Vue({
    render: h => h(App),
    router,
    store,
    i18n
}).$mount("#app");
