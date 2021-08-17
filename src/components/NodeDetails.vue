<template>
  <!-- Container for all html -->
  <v-card flat color="transparent" tag="div">
    <!-- Title -->
    <v-list-item>
      <v-list-item-icon>
        <v-icon size="40" class="mr-2">mdi-resistor-nodes</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title style="font-size: 30px;">
          Node Details
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Details -->
    <v-row>
      <v-col cols="4">
        <v-list>
          <template v-for="item of items">
            <v-card flat color="transparent" :key="item.key">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.value }}
                  </v-list-item-title>
                </v-list-item-content>
                {{ node[item.key] }}
              </v-list-item>
              <v-divider />
            </v-card>
          </template>

          <DatesDetails :item="node" />
        </v-list>
      </v-col>

      <!-- visuals -->
      <v-col cols="4">
        <div>
          <p>
            CRU
          </p>
          <v-row justify="center">
            <v-progress-circular
              :rotate="360"
              :size="size"
              :width="width"
              :value="getValue('cru')"
              color="primary"
              :style="'font-size:' + fontSize + 'px'"
            >
              {{ getValue("cru") }} %
            </v-progress-circular>
          </v-row>
        </div>
        <br />
        <v-divider />
        <br />

        <div>
          <p>
            MRU
          </p>
          <v-row justify="center">
            <v-progress-circular
              :rotate="360"
              :size="size"
              :width="width"
              :value="getValue('mru')"
              color="primary"
              :style="'font-size:' + fontSize + 'px'"
            >
              {{ getValue("mru") }} %
            </v-progress-circular>
          </v-row>
        </div>
      </v-col>

      <v-col cols="4">
        <div>
          <p>
            HRU
          </p>
          <v-row justify="center">
            <v-progress-circular
              :rotate="360"
              :size="size"
              :width="width"
              :value="getValue('hru')"
              color="primary"
              :style="'font-size:' + fontSize + 'px'"
            >
              {{ getValue("hru") }} %
            </v-progress-circular>
          </v-row>
        </div>
        <br />
        <v-divider />
        <br />

        <div>
          <p>
            SRU
          </p>
          <v-row justify="center">
            <v-progress-circular
              :rotate="360"
              :size="size"
              :width="width"
              :value="getValue('sru')"
              color="primary"
              :style="'font-size:' + fontSize + 'px'"
            >
              {{ getValue("sru") }} %
            </v-progress-circular>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { INode } from "@/graphql/api";
import DatesDetails from "./DatesDetails.vue";

function createItem(value: string, key?: keyof INode) {
  key = key ? key : (value.toLocaleLowerCase() as any);
  return { value, key } as { value: string; key: keyof INode };
}

@Component({
  components: {
    DatesDetails,
  },
})
export default class NodeDetails_ extends Vue {
  @Prop({ required: true }) node!: INode;
  size = 210;
  width = 10;
  fontSize = 25;

  // used for animation
  initLoading = true;

  items = [
    createItem("ID"),
    createItem("Version"),
    createItem("Grid Version", "gridVersion"),
    createItem("Uptime"),
    createItem("HRU"),
    createItem("SRU"),
    createItem("CRU"),
    createItem("MRU"),
  ];

  getValue(key: keyof INode): number {
    if (this.initLoading) {
      requestAnimationFrame(() => {
        this.initLoading = false;
      });
      return 0;
    }
    const v = this.node[key];
    const value = v ? +v / this.$store.getters.maxValueOf("nodes", key) : 0;

    return Math.round(value * 10000) / 100;
  }
}
</script>
