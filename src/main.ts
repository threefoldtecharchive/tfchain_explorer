import Vue from "vue";
import VueApollo from "vue-apollo";

import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import apolloProvider from "@/plugins/apollo";

Vue.config.productionTip = false;
Vue.use(VueApollo);

new Vue({
  router,
  vuetify,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
