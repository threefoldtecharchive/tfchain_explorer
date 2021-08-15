<template>
  <section>
    <v-checkbox
      class="shrink mr-0 mt-0"
      hide-details
      @change="toggleEnable"
      :value="option.enabled"
      :label="label"
    />

    <div v-if="option.name === 'all'">
      <v-switch
        :value="option.value"
        :label="inputLabel"
        @change="updateValue"
        :disabled="!option.enabled"
        hide-details
      ></v-switch>
    </div>

    <div v-else>
      <v-text-field
        class="shrink mr-0 mt-0"
        :type="option.name === 'in' ? 'text' : option.type"
        :value="option.value"
        hide-details
        :disabled="!option.enabled"
        @input="updateValue"
        :label="inputLabel"
      />
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FilterOptionModel, inMath, inMeaningful } from "@/utils/filter";

@Component({})
export default class FilterOptionDisplay extends Vue {
  @Prop({ required: true }) option!: FilterOptionModel;
  @Prop({ required: true }) filter!: string;

  get label(): string {
    return "By " + inMeaningful[this.option.name];
  }

  get inputLabel(): string {
    return `${this.filter} (${inMath[this.option.name]})`;
  }

  toggleEnable() {
    this.$store.commit("toggleFilterOptionEnable", {
      name: "nodes",
      filter: this.filter,
      option: this.filter + "_" + this.option.name,
    });
  }

  updateValue(value: any) {
    this.$store.commit("updateFilterOptionValue", {
      name: "nodes",
      filter: this.filter,
      option: this.filter + "_" + this.option.name,
      value,
    });
  }
}
</script>
