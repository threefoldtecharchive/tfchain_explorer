<template>
  <div class="container">
    <v-expansion-panels multiple accordion v-model="opened">
      <!-- l v-for="x in [1, 2, 3, 4]" :key="x" -->
      <v-expansion-panel>
        <v-expansion-panel-header disabled disable-icon-rotate>
          Item - {{ opened }}
          <template v-slot:actions>
            <v-checkbox
              class="shrink mr-0 mt-0"
              hide-details
              :value="open"
              @click="toggleOpen"
            />
          </template>
        </v-expansion-panel-header>
        <v-divider />
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class FilterPanel extends Vue {
  opened: number[] = [];
  open = false;

  toggleOpen() {
    if (this.open) {
      this.open = false;
      this.opened.pop();
    } else {
      this.open = true;
      this.opened.push(0);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: auto;
  width: 100%;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
