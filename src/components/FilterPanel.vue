<template>
  <div>
    <v-container>
      <v-row>
        <h3>Filters - {{ openList }}</h3>
        <v-spacer />
        <v-btn color="primary" @click="log">
          Apply
        </v-btn>
      </v-row>
    </v-container>
    <div class="div-spacer">
      <v-divider />
    </div>
    <div class="filter-container">
      <v-expansion-panels multiple accordion v-model="openList">
        <FilterOption
          v-for="(key, index) in keys"
          :key="key"
          :name="key"
          :index="index"
          :filter="filters[key]"
          v-on:toggle-open="toggleFilter"
        />
      </v-expansion-panels>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FilterOption from "@/components/FilterOption.vue";

@Component({
  components: {
    FilterOption,
  },
})
export default class FilterPanel extends Vue {
  openList: number[] = [];
  @Prop({ required: true }) filters!: any;

  get keys() {
    return Object.keys(this.filters);
  }

  toggleFilter(index: number, opened: boolean): void {
    console.log({ index, opened });
    if (opened) {
      this.openList.push(index);
      return;
    }

    const idx = this.openList.findIndex((v) => v === index);
    this.openList.splice(idx, 1);
  }

  log() {
    console.log(this.filters.generate());
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  height: auto;
  width: 100%;
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.div-spacer {
  margin: 10px 0;
}
</style>
