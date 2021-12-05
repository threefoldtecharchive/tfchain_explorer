<template>
  <v-container v-if="node.status">
    <div class="d-flex flex-row justify-center align-center mb-6">
      <div>
        <v-icon size="40" class="mr-2">mdi-chart-pie</v-icon>
      </div>
      <div style="font-size: 30px">Node Resources</div>
    </div>
    <!-- Details -->
    <v-row>
      <v-col cols="12">
        <div v-if="loader == false" class="d-flex justify-center">
          <div
            v-for="item in resources"
            :key="item.id"
            class="mx-6 d-flex flex-column align-center"
          >
            <div>{{ item.name }}</div>
            <div class="text-center">
              <v-progress-circular
                :value="item.value"
                :size="150"
                :width="15"
                color="teal"
                >{{ item.value }}%</v-progress-circular
              >
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="loader == true"
      color="teal"
      buffer-value="0"
      value="20"
      stream
    ></v-progress-linear>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { INode } from "@/graphql/api";

@Component({})
export default class NodeUsedResources extends Vue {
  @Prop({ required: true }) node!: INode;
  resources: any[] = [];
  loader = false;

  getNodeUsedResources(nodeId: number) {
    this.loader = true;

    return fetch(`https://gridproxy.dev.grid.tf/nodes/${nodeId}`)
      .then((res) => res.json())
      .then<any[]>((res) => {
        return ["cru", "sru", "hru", "mru"].map((i, idx) => {
          const value =
            res.capacity.total[i] != 0
              ? (res.capacity.used[i] / res.capacity.total[i]) * 100
              : 100; // prettier-ignore, validate if the total is zero so the usage is 100 else do the division
          return {
            id: idx + 1,
            value: value.toFixed(2),
            name: i.toUpperCase(),
          };
        });
      })
      .catch((err) => console.log("something went wrong", err))
      .finally(() => (this.loader = false));
  }
  created() {
    this.getNodeUsedResources(this.node.nodeId).then((resources) => {
      if (resources) {
        this.resources = resources;
      }
    });
  }
}
</script>
