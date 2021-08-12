<template>
  <v-expansion-panel>
    <v-expansion-panel-header disabled disable-icon-rotate>
      <span class="filter-title">By {{ name | optionTitle }}</span>
      <template v-slot:actions>
        <v-checkbox
          class="shrink mr-0 mt-0"
          hide-details
          @change="toggleOpen"
          :value="opened"
        />
      </template>
    </v-expansion-panel-header>
    <v-divider />
    <v-expansion-panel-content>
      <v-btn color="primary" @click="changeFirstKey">
        {{ keys[0] }}
      </v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  // props: {
  //   value: Object,
  // },
})
export default class FilterOption extends Vue {
  @Prop({ required: true }) index!: number;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) filter!: any;
  opened = false;

  get keys() {
    return Object.keys(this.filter);
  }

  toggleOpen() {
    this.opened = !this.opened;
    this.$emit("toggle-open", this.index, this.opened);
  }

  changeFirstKey() {
    this.filter.set(this.keys[0], 5);
  }
}
</script>
<style lang="scss" scoped>
.filter-title {
  text-transform: capitalize;
}
</style>
