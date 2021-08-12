<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon>
      <v-btn icon @click="$emit('toggle-sidenav')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar-nav-icon>
    <v-app-bar-title>
      TF Explorer
    </v-app-bar-title>
  </v-app-bar>
</template>
