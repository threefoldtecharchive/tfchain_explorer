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
        {{ filter.label }}
      </v-chip>
    </template>

    <template v-slot:active-filters>
      <div v-for="filter in activeFilters" :key="filter.key">
        <InFilter
          key1="nodes"
          :key2="filter.key"
          :label="filter.placeholder"
          v-if="filter.type === 'in'"
        />
        <RangeFilter
          v-if="filter.type === 'range'"
          key1="nodes"
          :key2="filter.key"
          :label="filter.placeholder"
          :max="filter.max"
        />
        <ConditionFilter
          v-if="filter.type === 'condition'"
          key1="nodes"
          :key2="filter.key"
          :labels="filter.placeholder"
        />
        <ComparisonFilter
          key1="nodes"
          :key2="filter.key"
          :label="filter.placeholder"
          :prefix="filter.prefix"
          v-if="filter.type === 'comparison'"
        />
      </div>
    </template>

    <template v-slot:table>
      <div
        style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center;"
      >
        <div>
          <v-switch
            v-model="withGateway"
            style="margin-bottom: -30px;"
            label="Gateways"
          />
          <v-switch v-model="onlyOnline" label="Online" />
        </div>
      </div>
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
        :config="node && node.publicConfig"
        v-on:close-sheet="closeSheet"
      />
    </template>

    <template v-slot:default>
      <NodesDistribution v-if="$store.getters.nodes.length > 0" />
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
import ComparisonFilter from "@/components/ComparisonFilter.vue";
@Component({
  components: {
    Layout,
    Details,
    InFilter,
    RangeFilter,
    NodesDistribution,
    ConditionFilter,
    ComparisonFilter,
  },
})
export default class Nodes extends Vue {
  withGateway = false;
  onlyOnline = false;

  headers = [
    { text: "ID", value: "nodeId" },
    { text: "Farm ID", value: "farmId", align: "center" },
    { text: "Farm Public IPs", value: "publicIPs", align: "center" },
    { text: "HRU", value: "hru", align: "center" },
    { text: "SRU", value: "sru", align: "center" },
    { text: "MRU", value: "mru", align: "center" },
    { text: "CRU", value: "cru", align: "center" },
    { text: "Up Time", value: "uptime", align: "center" },
    { text: "CREATED", value: "created", align: "center" },
  ];

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  activeFilters: any[] = [
    {
      label: "HRU",
      type: "range",
      active: true,
      key: "hru",
      placeholder: "hru",
      max: 1e12 * 300, // 1e12 is Terra and we want here 300 Terrabytes
    },
    {
      label: "MRU",
      type: "range",
      active: true,
      key: "mru",
      placeholder: "mru",
      max: 1e12 * 10, // 1e12 is Terra and we want here 10 Terrabytes
    },
    {
      label: "CRU",
      type: "range",
      active: true,
      key: "cru",
      placeholder: "cru",
      max: 60,
    },
  ];

  filters = [
    {
      label: "Node ID",
      type: "in",
      active: false,
      key: "nodeId",
      placeholder: "Filter by node id.",
    },
    {
      label: "Farm ID",
      type: "in",
      active: false,
      key: "farmId",
      placeholder: "Filter by farm id.",
    },
    {
      label: "Twin ID",
      type: "in",
      active: false,
      key: "twinId",
      placeholder: "Filter by twin id.",
    },
    {
      label: "Country Full Name",
      type: "in",
      active: false,
      key: "countryFullName",
      placeholder: "Filter by country.",
    },
    {
      label: "Farming Policy",
      type: "in",
      active: false,
      key: "farmingPolicyName",
      placeholder: "Filter by farming policy name.",
    },
    {
      label: "SRU",
      type: "range",
      active: false,
      key: "sru",
      placeholder: "sru",
      max: 1e12 * 10, // 1e12 is Terra and we want here 10 Terrabytes
    },
    ...this.activeFilters,
    {
      label: "Nodes Status",
      type: "condition",
      active: false,
      key: "status",
      placeholder: ["Status", "Offline", "Online"],
    },
    {
      label: "Public IP",
      type: "comparison",
      active: false,
      key: "publicIPs",
      placeholder: "Filter by greater than or equal to publicIp Number.",
      prefix: ">=",
    },
  ];

  getNodes() {
    let nodes: INode[] = this.$store.getters.filtered_nodes;
    if (this.withGateway) {
      nodes = nodes.filter(({ publicConfig }) => publicConfig !== null);
    }

    if (this.onlyOnline) {
      nodes = nodes.filter(({ status }) => status === true);
    }

    return nodes;
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
}
</script>
