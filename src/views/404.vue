<template>
  <v-card flat color="white">
    <v-container class="notfound">
      <img src="@/assets/404.svg" alt="Page Not Found." />
    </v-container>
  </v-card>
</template>

<style scoped>
.notfound {
  height: calc(100vh - 64px);
  padding: 100px 50px;
  text-align: center;
}

img {
  height: 100%;
  max-width: 100%;
}
</style>
