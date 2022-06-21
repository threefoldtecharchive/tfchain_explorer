<template>
  <v-app>
    <Sidenav :mini="mini" />
    <v-main>
      <v-app-bar color="red">
        Check out our new &nbsp;
        <a
          href="https://dashboard.qa.grid.tf/"
          class="text-decoration-none"
          target="_blank"
        >
          Dashboard (Beta) </a
        >&nbsp; which is planned to be a replacement for this explorer red
      </v-app-bar>
      <Navbar :mini="mini" v-on:toggle-sidenav="mini = !mini" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidenav from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import { ActionTypes } from "./store/actions";

@Component({
  components: {
    Sidenav,
    Navbar,
  },
})
export default class App extends Vue {
  mini = true;

  created() {
    this.$store.dispatch(ActionTypes.INIT_POLICIES);
    this.$store.dispatch("loadChainData");
    this.$store.dispatch(ActionTypes.LOAD_DATA);
    this.$store.dispatch("loadNodesData");
    setInterval(() => {
      this.$store.dispatch(ActionTypes.LOAD_DATA);
    }, 5 * 60 * 1000);
  }
}
</script>

<style>
[role="listitem"] {
  overflow-y: hidden;
  text-overflow: ellipsis;
}
</style>
