<template>
  <v-app>
    <Sidenav :mini="mini" />
    <v-main>
      <Navbar :mini="mini" v-on:toggle-sidenav="mini = !mini" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidenav from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

@Component({
  components: {
    Sidenav,
    Navbar,
  },
})
export default class App extends Vue {
  mini = true;

  created() {
    this.$store.dispatch("loadData");
    setInterval(() => {
      this.$store.dispatch("loadData");
    }, 60 * 1000);
  }
}
</script>

<style>
[role="listitem"] {
  overflow-y: hidden;
  text-overflow: ellipsis;
}
</style>
