import Vue from "vue";
import Vuex from "vuex";
import { nodes } from "@/graphql/nodeFilter";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes,
  },
  getters: {
    filters(state) {
      return (name: keyof typeof state) => state[name].filters;
    },
  },
  mutations: {
    toggleFilterEnable(
      state,
      payload: { name: keyof typeof state; filter: string }
    ) {
      const { name, filter } = payload;
      const ref = state[name].filters[filter];
      ref.enabled = !ref.enabled;
    },
    toggleFilterOptionEnable(
      state,
      payload: { name: keyof typeof state; filter: string; option: string }
    ) {
      const { name, filter, option } = payload;
      const ref = state[name].filters[filter].options[option];
      ref.enabled = !ref.enabled;
    },
    updateFilterOptionValue(
      state,
      // prettier-ignore
      payload: { name: keyof typeof state; filter: string; option: string, value: string }
    ) {
      const { name, filter, option, value } = payload;
      state[name].filters[filter].options[option].value = value;
    },
  },
  actions: {},
  modules: {},
});
