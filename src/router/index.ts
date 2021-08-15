import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Nodes",
    component: () => import("../views/Nodes.vue"),
  },
  {
    path: "/farms",
    name: "Farms",
    component: () => import("../views/Farms.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
