<template>
  <v-card flat color="transparent">
    <v-subheader>{{ label }}</v-subheader>
    <v-text-field
      :type="type"
      :label="label"
      :placeholder="label"
      solo
      clearable
      v-model="val"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "SearchFilter",
})
export default class SearchFilter extends Vue {
  @Prop({ required: true }) label!: string;
  @Prop({ required: true }) value!: string;
  @Prop({ default: "text" }) type!: string;

  val = this.value;

  @Watch("val")
  onValChange() {
    this.$emit("input", this.val);
  }
}
</script>
