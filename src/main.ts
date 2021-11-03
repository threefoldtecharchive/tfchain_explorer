import Vue from "vue";
import VueApollo from "vue-apollo";

import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import apolloProvider from "@/plugins/apollo";
import dateFiler from "@/filters/date";
import optionTitleFiler from "@/filters/optionTitle";
import store from "./store";
import toTeraOrGigaOrPeta from "./filters/toTeraOrGigaOrPeta";
import secondToRedable from "./filters/secondToRedable";

Vue.config.productionTip = false;
Vue.use(VueApollo);
Vue.filter("date", dateFiler);
Vue.filter("optionTitle", optionTitleFiler);
Vue.filter("toTeraOrGigaOrPeta", toTeraOrGigaOrPeta);
Vue.filter("secondToRedable", secondToRedable);

new Vue({
  router,
  vuetify,
  apolloProvider,
  store,
  render: (h) => h(App),
}).$mount("#app");
