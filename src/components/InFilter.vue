<template>
  <v-combobox
    v-model="items"
    :items="$store.getters.nodes_id"
    chips
    clearable
    :label="label"
    multiple
    prefix="in:"
    solo
    type="text"
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
</template>
<script lang="ts">
import { MutationTypes } from "@/store/mutations";
import { IState } from "@/store/state";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class InFilter extends Vue {
  @Prop({ required: true }) key1!: keyof IState["filters"];
  @Prop({ required: true }) key2!: string;
  @Prop({ required: true }) label!: string;

  get items(): string[] {
    return this.$store.getters.getFilter(this.key1, this.key2);
  }

  set items(value: string[]) {
    this.$store.commit(MutationTypes.SET_FILTER, {
      key1: this.key1,
      key2: this.key2,
      value,
    });
  }

  remove(item: string): void {
    const items = this.items;
    const idx = items.findIndex((i) => i == item);
    if (idx > -1) {
      items.splice(idx, 1);
      this.items = items;
    }
  }
}
</script>
