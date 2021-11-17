<template>
  <v-container>
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
import axios from "axios";

@Component({})
export default class NodeUsedResources extends Vue {
  @Prop({ required: true }) node!: INode;
  resources: any[] = [];
  loader = false;

  getNodeUsedResources(nodeId: number) {
    let resources: any[] = [];
    const gridProxyUrl = `https://gridproxy.dev.grid.tf/nodes/${nodeId}`;
    this.loader = true;
    axios
      .get(gridProxyUrl)
      .then((res) => {
        let used_cru_perc =
          (res.data.capacity.used["cru"] / res.data.capacity.total["cru"]) *
          100;
        let used_sru_perc =
          (res.data.capacity.used["sru"] / res.data.capacity.total["sru"]) *
          100;
        let used_hru_perc =
          (res.data.capacity.used["hru"] / res.data.capacity.total["hru"]) *
          100;
        let used_mru_perc =
          (res.data.capacity.used["mru"] / res.data.capacity.total["mru"]) *
          100;

        resources.push({ id: 1, name: "CRU", value: used_cru_perc.toFixed(2) });
        resources.push({ id: 2, name: "SRU", value: used_sru_perc.toFixed(2) });
        resources.push({ id: 3, name: "HRU", value: used_hru_perc.toFixed(2) });
        resources.push({ id: 4, name: "MRU", value: used_mru_perc.toFixed(2) });
        this.loader = false;
      })
      .catch((err) => console.log("something went wrong", err));

    return resources;
  }
  created() {
    this.resources = this.getNodeUsedResources(this.node.nodeId);
  }
}
</script>
