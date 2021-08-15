<template>
  <v-expansion-panel>
    <v-expansion-panel-header disabled disable-icon-rotate>
      <span class="filter-title">By {{ filterName | optionTitle }}</span>
      <template v-slot:actions>
        <v-checkbox
          class="shrink mr-0 mt-0"
          hide-details
          @change="toggleEnable"
          :value="filter.enabled"
        />
      </template>
    </v-expansion-panel-header>
    <v-divider />
    <v-expansion-panel-content>
      <div v-for="(key, i) in keys" :key="key">
        <FilterOptionDisplay
          :name="name"
          :filterName="filterName"
          :option="filter.options[key]"
        />
        <template v-if="i + 1 != keys.length">
          <br />
          <v-divider />
          <br />
        </template>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FilterOptionDisplay from "@/components/FilterOptionDisplay.vue";
import { createFilterOption } from "@/utils/filter";

@Component({
  components: {
    FilterOptionDisplay,
  },
})
export default class FilterOption extends Vue {
  @Prop({ required: true }) index!: number;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) filterName!: string;
  @Prop({ required: true }) filter!: ReturnType<typeof createFilterOption>;

  get keys() {
    return Object.keys(this.filter.options);
  }

  toggleEnable() {
    this.$emit("toggle-open", this.index);
    this.$store.commit("toggleFilterEnable", {
      name: this.name,
      filter: this.filterName,
    });
  }
}
</script>
<style lang="scss" scoped>
.filter-title {
  text-transform: capitalize;
}
</style>
