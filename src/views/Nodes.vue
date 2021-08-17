<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="3">
        <h3>
          Filters
        </h3>
        <br />
        <v-divider />
        <InFilter key1="nodes" key2="nodeId" label="Filter by node id." />
        <InFilter
          key1="nodes"
          key2="createdById"
          label="Filter by createdby."
        />
        <InFilter key1="nodes" key2="farmId" label="Filter by farm id." />
        <InFilter key1="nodes" key2="twinId" label="Filter by twin id." />
        <InFilter
          key1="nodes"
          key2="locationId"
          label="Filter by location id."
        />
        <InFilter
          key1="nodes"
          key2="farmingPolicyId"
          label="Filter by farming policy id."
        />
        <RangeFilter key1="nodes" key2="hru" label="hru" />
        <RangeFilter key1="nodes" key2="cru" label="cru" />
        <RangeFilter key1="nodes" key2="mru" label="mru" />
        <RangeFilter key1="nodes" key2="sru" label="sru" />
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
import { INode } from "@/graphql/api";
import InFilter from "@/components/InFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";

@Component({
  components: {
    NodeDetails,
    InFilter,
    RangeFilter,
  },
})
export default class Nodes extends Vue {
  headers = [
    { text: "ID", value: "nodeId" },
    { text: "VERSION", value: "version" },
    { text: "GRID VERSION", value: "gridVersion", align: "center" },
    { text: "HRU", value: "hru", align: "center" },
    { text: "SRU", value: "sru", align: "center" },
    { text: "CRU", value: "cru", align: "center" },
    { text: "MRU", value: "mru", align: "center" },
    { text: "CREATED AT", value: "createdAt", align: "center" },
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
