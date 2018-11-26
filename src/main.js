import Vue from "vue";

import VueRouter from "vue-router";
import router from "./routes.js";

import Notifications from "vue-notification";

import i18n from "./lang.js";

import store from "./store/store.js";

import {Cytomine} from "cytomine-client";
import constants from "./utils/constants.js";

import Buefy from "buefy";
import "buefy/dist/buefy.css";

import VTooltip from "v-tooltip";

import VueMoment from "vue-moment";
const moment = require("moment");

import VueShortKey from "vue-shortkey";

import * as vClickOutside from "v-click-outside-x";

import App from "./App.vue";

Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(Buefy, {defaultIconPack: "fa"});
Vue.use(VueMoment, {moment});
Vue.use(VueShortKey, { prevent: ["input", "textarea"] });
Vue.use(vClickOutside);
Vue.use(VTooltip);
Vue.config.productionTip = false;

new Cytomine(constants.CYTOMINE_CORE_HOST);

new Vue({
    render: h => h(App),
    router,
    store,
    i18n
}).$mount("#app");
