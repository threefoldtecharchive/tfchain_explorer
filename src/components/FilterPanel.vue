<template>
  <div>
    <v-container>
      <v-row>
        <h3>Filters</h3>
        <v-spacer />
        <v-btn color="primary" @click="$emit('apply-filter')">
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
          :name="name"
          :filterName="key"
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
import { FilterModel } from "@/utils/filter";

@Component({
  components: {
    FilterOption,
  },
})
export default class FilterPanel extends Vue {
  @Prop({ required: true }) filters!: FilterModel["filters"];
  @Prop({ required: true }) name!: string;

  openList: number[] = [];

  get keys() {
    return Object.keys(this.filters);
  }

  toggleFilter(index: number): void {
    const idx = this.openList.findIndex((v) => v === index);
    if (idx === -1) {
      this.openList.push(index);
    } else {
      this.openList.splice(idx, 1);
    }
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
