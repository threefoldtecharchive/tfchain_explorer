<template>
  <p>
    {{ option }}
    <button @click="toggleEnable">
      toggle
    </button>
  </p>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FilterOptionModel } from "@/utils/filter";

@Component({})
export default class FilterOptionDisplay extends Vue {
  @Prop({ required: true }) option!: FilterOptionModel;
  @Prop({ required: true }) filter!: string;

  toggleEnable() {
    this.$store.commit("toggleFilterOptionEnable", {
      name: "nodes",
      filter: this.filter,
      option: this.filter + "_" + this.option.name,
    });
  }
}
</script>
