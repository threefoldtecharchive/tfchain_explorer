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
import { byInternet, byCountry } from "country-code-lookup";

@Component({})
export default class InFilter extends Vue {
  @Prop({ required: true }) key1!: keyof IState["filters"];
  @Prop({ required: true }) key2!: string;
  @Prop({ required: true }) label!: string;
  @Prop() value?: string[];

  get _values(): (string | number)[] {
    if (this.value) {
      return this.value;
    }
    //In case of country filter: Get the country name from the country Code in case of country filter
    if (this.key2 == "country") {
      return this.$store.getters[this.key1].map(
        (e: any) => byInternet(e[this.key2])?.country
      );
    }
    return this.$store.getters[this.key1].map((e: any) => e[this.key2]);
  }

  get items(): string[] {
    if (this.key2 == "country") {
      let res: any[] = [];
      let values = this.$store.getters.getFilter(this.key1, this.key2).value;
      values.forEach((val: any) => {
        try {
          res.push(byInternet(val)?.country);
        } catch (err) {
          console.log("Error while getting the country name", err);
        }
      });
      return res;
    }
    return this.$store.getters.getFilter(this.key1, this.key2).value;
  }

  set items(value: string[]) {
    if (this.key2 == "country") {
      let res: any[] = [];
      value.forEach((val) => {
        try {
          res.push(byCountry(val)?.internet);
        } catch (err) {
          console.log("Error while getting the country name", err);
        }
      });
      value = res;
    }
    this.$store.commit(MutationTypes.SET_FILTER_VALUE, {
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

  created() {
    this.$store.commit(MutationTypes.SET_FILTER_ENABLE, {
      key1: this.key1,
      key2: this.key2,
      value: true,
    });
  }

  destroyed() {
    this.$store.commit(MutationTypes.SET_FILTER_ENABLE, {
      key1: this.key1,
      key2: this.key2,
      value: false,
    });
  }
}
</script>
