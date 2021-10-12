<template>
  <v-card flat color="transparent">
    <v-subheader>{{ label.toLocaleUpperCase() }}</v-subheader>
    <v-combobox
      v-model="items"
      :items="_values"
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
  </v-card>
</template>
<script lang="ts">
import { MutationTypes } from "@/store/mutations";
import { IState } from "@/store/state";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class InFilter extends Vue {
  @Prop({ required: true }) key1!: keyof IState["filters"];
  @Prop({ required: true }) key2!: string | string[];
  @Prop({ required: true }) label!: string;
  @Prop() value?: string[];

  get _values(): (string | number)[] {
    if (this.value) {
      return this.value;
    }

    const ks = typeof this.key2 === "string" ? [this.key2] : this.key2;

    // prettier-ignore
    return this
      .$store
      .getters[this.key1]
      .reduce((prev: any[], current: any) => {
        let item = current;
        for (const k of ks) {
          if (item) {
            item = item[k];
          }
        }

        if (item) {
          prev.push(item);
        }
        return prev;
      }, []);
  }

  get items(): string[] {
    return this.$store.getters.getFilter(this.key1, this._key2()).value;
  }

  set items(value: string[]) {
    this.$store.commit(MutationTypes.SET_FILTER_VALUE, {
      key1: this.key1,
      key2: this._key2(),
      value,
    });
  }

  private _key2(): string {
    return Array.isArray(this.key2)
      ? this.key2[this.key2.length - 1]
      : this.key2;
  }

  remove(item: string): void {
    const items = this.items;
    const idx = items.findIndex((i) => i == item);
    if (idx > -1) {
      items.splice(idx, 1);
      this.items = items;
    }
  }

  created() {
    this.$store.commit(MutationTypes.SET_FILTER_ENABLE, {
      key1: this.key1,
      key2: this._key2(),
      value: true,
    });
  }

  destroyed() {
    this.$store.commit(MutationTypes.SET_FILTER_ENABLE, {
      key1: this.key1,
      key2: this._key2(),
      value: false,
    });
  }
}
</script>
