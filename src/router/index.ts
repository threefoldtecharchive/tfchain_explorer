import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/nodes",
    name: "Nodes",
    component: () => import("../views/Nodes.vue"),
  },
  {
    path: "/",
    name: "Statistics",
    component: () => import("../views/Statistics.vue"),
  },
  {
    path: "/farms",
    name: "Farms",
    component: () => import("../views/Farms.vue"),
  },
  {
    path: "*",
    name: "PageNotFound",
    component: () => import("../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
