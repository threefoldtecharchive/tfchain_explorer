<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="3">
        <InFilter key1="nodes" key2="ids" label="Filter by node id." />
      </v-col>
      <v-col cols="9">
        <v-data-table
          :loading="$store.getters.loading"
          loading-text="Loading..."
          :headers="headers"
          :items="$store.getters.filtered_nodes"
          :items-per-page="10"
          class="elevation-1"
          align
          @click:row="openSheet"
        >
          <template v-slot:[`item.version`]="{ item }">
            v{{ item.version }}.0
          </template>
          <template v-slot:[`item.gridVersion`]="{ item }">
            v{{ item.version }}.0
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ item.createdAt | date }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <NodeDetails
      :open="!!activeNode"
      :node="activeNode"
      v-on:close-sheet="closeSheet"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NodeDetails from "@/components/NodeDetails.vue";
import InFilter from "@/components/InFilter.vue";
import { INode } from "@/graphql/api";

@Component({
  components: {
    NodeDetails,
    InFilter,
  },
})
export default class Nodes extends Vue {
  headers = [
    { text: "ID", value: "nodeId" },
    { text: "Farm ID", value: "farmId", align: "center" },
    { text: "Ver", value: "version" },
    { text: "GridVer", value: "gridVersion", align: "center" },
    { text: "hru", value: "hru", align: "center" },
    { text: "sru", value: "sru", align: "center" },
    { text: "cru", value: "cru", align: "center" },
    { text: "mru", value: "mru", align: "center" },
    { text: "CreatedAt", value: "createdAt", align: "center" },
  ];

  activeNode: INode | null = null;

  openSheet(node: INode): void {
    this.activeNode = node;
  }

  closeSheet(): void {
    this.activeNode = null;
  }
}
</script>

<style lang="scss" scoped>
.loader {
  height: 80vh;
}
</style>
