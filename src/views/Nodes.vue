<template>
  <Layout pageName="Nodes">
    <template v-slot:filters>
      <v-chip
        v-for="(filter, idx) in filters"
        :key="filter.key"
        class="ma-2"
        v-model="filter.active"
        @click="toggleActive(idx)"
        filter
      >
        {{ getChipLabel(filter) }}
      </v-chip>
    </template>

    <template v-slot:active-filters>
      <div v-for="filter in activeFilters" :key="filter.key">
        <InFilter
          key1="nodes"
          :key2="filter.key"
          :label="filter.label"
          v-if="filter.type === 'in'"
        />
        <RangeFilter
          v-if="filter.type === 'range'"
          key1="nodes"
          :key2="filter.key"
          :label="filter.label"
        />
        <ConditionFilter
          v-if="filter.type === 'condition'"
          key1="nodes"
          :key2="filter.key"
          :labels="filter.label"
        />
      </div>
    </template>

    <template v-slot:table>
      <v-row align="center" justify="end">
        Show Nodes With Gateways Only
        <v-switch v-model="withGateway" class="ml-4"></v-switch>
      </v-row>
      <v-data-table
        ref="table"
        :loading="$store.getters.loading"
        loading-text="Loading..."
        :headers="headers"
        :items="getNodes()"
        :items-per-page="10"
        class="elevation-1"
        align
        @click:row="openSheet"
      >
        <template v-slot:[`item.gridVersion`]="{ item }">
          v{{ item.gridVersion }}.0
        </template>
        <template v-slot:[`item.created`]="{ item }">
          {{ item.created | date }}
        </template>

        <template v-slot:[`item.hru`]="{ item }">
          {{ item.hru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.sru`]="{ item }">
          {{ item.sru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.mru`]="{ item }">
          {{ item.mru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.uptime`]="{ item }">
          {{ item.uptime | secondToRedable }}
        </template>
      </v-data-table>
    </template>

    <template v-slot:details>
      <Details
        :open="!!node"
        :node="node"
        :farm="$store.getters.farm(node && node.farmId)"
        :country="node && node.country"
        :city="node && node.city"
        :location="node && node.location"
        :twin="$store.getters.twin(node && node.twinId)"
        :config="$store.getters.publicConfig(node && node.publicConfigId)"
        v-on:close-sheet="closeSheet"
      />
    </template>

    <template v-slot:default>
      <NodesDistribution />
    </template>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Details from "@/components/Details.vue";
import { INode } from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import InFilter from "@/components/InFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";
import NodesDistribution from "@/components/NodesDistribution.vue";
import ConditionFilter from "@/components/ConditionFilter.vue";

@Component({
  components: {
    Layout,
    Details,
    InFilter,
    RangeFilter,
    NodesDistribution,
    ConditionFilter,
  },
})
export default class Nodes extends Vue {
  withGateway = false;

  headers = [
    { text: "ID", value: "nodeId" },
    { text: "Farm ID", value: "farmId", align: "center" },
    { text: "GRID VERSION", value: "gridVersion", align: "center" },
    { text: "HRU", value: "hru", align: "center" },
    { text: "SRU", value: "sru", align: "center" },
    { text: "MRU", value: "mru", align: "center" },
    { text: "CRU", value: "cru", align: "center" },
    { text: "Up Time", value: "uptime", align: "center" },
    { text: "CREATED", value: "created", align: "center" },
  ];

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  activeFilters = [
    {
      type: "range",
      active: true,
      key: "hru",
      label: "hru",
    },
    {
      type: "range",
      active: true,
      key: "mru",
      label: "mru",
    },
    {
      type: "range",
      active: true,
      key: "cru",
      label: "cru",
    },
  ];
  filters = [
    {
      type: "in",
      active: false,
      key: "nodeId",
      label: "Filter by node id.",
    },
    {
      type: "in",
      active: false,
      key: "createdById",
      label: "Filter by createdby.",
    },
    {
      type: "in",
      active: false,
      key: "farmId",
      label: "Filter by farm id.",
    },
    {
      type: "in",
      active: false,
      key: "twinId",
      label: "Filter by twin id.",
    },
    {
      type: "in",
      active: false,
      key: "country",
      label: "Filter by country.",
    },
    {
      type: "in",
      active: false,
      key: "farmingPolicyId",
      label: "Filter by farming policy id.",
    },
    {
      type: "range",
      active: false,
      key: "sru",
      label: "sru",
    },
    ...this.activeFilters,
    {
      type: "condition",
      active: false,
      key: "uptime",
      label: ["Status", "Offline", "Online"],
    },
  ];

  getNodes() {
    const nodes: INode[] = this.$store.getters.filtered_nodes;
    if (!this.withGateway) {
      return nodes;
    }
    return nodes.filter(({ publicConfigId }) => publicConfigId !== null);
  }

  toggleActive(idx: number) {
    const filter: any = this.filters[idx];

    if (filter.active) {
      this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
      filter.active = false;
    } else {
      filter.active = true;
      this.activeFilters.push(filter);
    }
  }

  node: INode | null = null;

  openSheet(node: INode): void {
    this.node = node;
  }

  closeSheet(): void {
    this.node = null;
  }

  getChipLabel(filter: any): string {
    let v = filter.key;
    if (filter.type === "condition") {
      v = filter.label[0];
    }
    return v.toUpperCase();
  }
}
</script>
