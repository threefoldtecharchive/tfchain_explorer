<template>
  <v-navigation-drawer fixed permanent app :mini-variant="mini">
    <v-list-item class="logo">
      <v-list-item-content class="logo__content">
        <img src="@/assets/logo.png" class="logo__image" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list>
      <v-list-item
        link
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Sidebar extends Vue {
  @Prop({ required: true }) mini!: boolean;

  items = [
    { title: "Nodes", icon: "mdi-resistor-nodes", route: "/" },
    { title: "Farms", icon: "mdi-webpack", route: "/farms" },
  ];
}
</script>

<style lang="scss" scoped>
.logo {
  min-height: 64px;

  &__content {
    justify-content: center;
    align-items: center;
  }

  &__image {
    flex: 0;
    width: 100%;
  }
}
</style>
