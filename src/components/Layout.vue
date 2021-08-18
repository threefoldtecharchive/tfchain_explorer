<template>
  <v-container fluid>
    <h1>
      {{ pageName }}
    </h1>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="3">
        <h3>
          Filters
        </h3>
        <br />
        <v-row>
          <slot name="filters"></slot>
        </v-row>
        <br />
        <v-divider />
        <section class="filter-container">
          <slot name="active-filters"></slot>
        </section>
      </v-col>
      <v-col cols="9">
        <slot name="table"></slot>
      </v-col>
    </v-row>
    <slot name="details"></slot>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Layout extends Vue {
  @Prop({ required: true }) pageName!: string;
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-right: 10px;
  max-height: 350px;
  overflow-x: hidden;
  overflow-y: auto;
  will-change: transform;
}
</style>
