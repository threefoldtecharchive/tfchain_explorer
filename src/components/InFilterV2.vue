<template>
  <v-card flat color="transparent">
    <v-subheader>{{ options.label.toLocaleUpperCase() }}</v-subheader>
    <v-combobox
      :items="searchItems"
      chips
      clearable
      :label="options.label"
      solo
      type="text"
      :loading="loading"
      @keydown="search"
      v-model="value"
      @change="$emit('input', value)"
    />
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import IFilterOptions from "@/types/FilterOptions";
import { throttle } from "lodash";

@Component({
  name: "InFilterV2",
})
export default class InFilterV2 extends Vue {
  @Prop({ required: true }) value!: string;
  @Prop({ required: true }) options!: IFilterOptions["filter"];

  loading = false;
  searchItems: string[] = [];

  public search = throttle(this._search.bind(this), 1000);
  private _search({ target }: { target: HTMLInputElement }) {
    this.loading = true;
    this.options
      .items(target.value)
      .then((res) => {
        this.searchItems = res;
      })
      .catch(() => null)
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
