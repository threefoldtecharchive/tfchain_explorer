<template>
  <v-app>
    <Sidenav :mini="mini" />
    <v-main>
      <navbar :mini="mini" v-on:toggle-sidenav="mini = !mini" />
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
}
</script>
