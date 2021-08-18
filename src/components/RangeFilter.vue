<template>
  <v-card flat color="transparent">
    <v-subheader>{{ label.toLocaleUpperCase() }}</v-subheader>

    <v-card-text>
      <v-row>
        <v-col class="px-4">
          <v-range-slider
            v-model="range"
            :max="_max"
            :min="_min"
            hide-details
            class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="range[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                @input="onChange({ min: $event })"
                style="width: 40px; text-align: center;"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="range[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 40px; text-align: center;"
                @change="onChange({ max: $event })"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { MutationTypes } from "@/store/mutations";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class RangeFilter extends Vue {
  @Prop({ required: true }) key1!: string;
  @Prop({ required: true }) key2!: string;
  @Prop({ required: true }) label!: string;
  @Prop() min?: number;
  @Prop() max?: number;

  get _min(): number {
    return this.min || 0;
  }

  get _max(): number {
    return this.max || Number.MAX_SAFE_INTEGER;
  }

  get range(): [number, number] {
    const { min, max } = this.$store.getters.getFilter(
      this.key1,
      this.key2
    ).value;
    return [min, max];
  }

  set range([min, max]: [number, number]) {
    this.$store.commit(MutationTypes.SET_FILTER_VALUE, {
      key1: this.key1,
      key2: this.key2,
      value: { min, max },
    });
  }

  onChange({ min = this.range[0], max = this.range[1] }): void {
    this.range = [min, max];
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
