<template>
  <v-expansion-panel>
    <v-expansion-panel-header disabled disable-icon-rotate>
      <span class="filter-title">By {{ name | optionTitle }}</span>
      <template v-slot:actions>
        <v-checkbox
          class="shrink mr-0 mt-0"
          hide-details
          @change="toggleEnable"
          :value="opened"
        />
      </template>
    </v-expansion-panel-header>
    <v-divider />
    <v-expansion-panel-content>
      <FilterOptionDisplay
        v-for="key in keys"
        :key="key"
        :filter="name"
        :option="filter.options[key]"
      />
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
  @Prop({ required: true }) filter!: ReturnType<typeof createFilterOption>;
  opened = false;

  get keys() {
    return Object.keys(this.filter.options);
  }

  toggleEnable() {
    this.opened = !this.opened;
    this.$emit("toggle-open", this.index, this.opened);
    this.$store.commit("toggleFilterEnable", {
      name: "nodes",
      filter: this.name,
    });
  }
}
</script>
<style lang="scss" scoped>
.filter-title {
  text-transform: capitalize;
}
</style>
