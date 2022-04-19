<template>
  <Layout pageName="Nodes">
    <template v-slot:filters>
      <LayoutFilters
        :items="filters.map((f) => f.label)"
        v-model="activeFiltersKeys"
      />
    </template>

    <template v-slot:active-filters>
      <!-- <div v-for="filter in activeFilters" :key="filter.label">
        <component
          :is="filter.component"
          :options="filter"
          v-model="filter.value"
          @input="changed = true"
        />
      </div> -->
    </template>

    <template v-slot:table>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
        "
      >
        <div>
          <v-switch
            v-model="withGateway"
            style="margin-bottom: -30px"
            label="Gateways"
          />
          <v-switch v-model="onlyOnline" label="Online" />
        </div>
      </div>
      <div class="d-flex justify-center">
        <v-alert dense text type="success">
          Node statuses are updated every 2 hours.
        </v-alert>
      </div>
      <v-data-table
        :loading="loading"
        loading-text="Loading..."
        :headers="headers"
        :items="nodes"
        :items-per-page="15"
        class="elevation-1"
        align
        :server-items-length="count"
        :footer-props="{
          'disable-items-per-page': true,
          'disable-pagination': loading,
        }"
        :disable-pagination="loading"
        disable-sort
        @update:options="onLoadNodes($event.page)"
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
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DetailsV2 from "@/components/DetailsV2.vue";
import { IFarm, INode } from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import InFilter from "@/components/InFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";
import NodesDistribution from "@/components/NodesDistribution.vue";
import ConditionFilter from "@/components/ConditionFilter.vue";
import ComparisonFilter from "@/components/ComparisonFilter.vue";
import LayoutFilters from "@/components/LayoutFilters.vue";
import { GridProxy } from "@/utils/gridProxy";
import { NodeQuries } from "@/types/gridProxy";
import {
  getFarmFreePublicIps,
  getFarmUsedPublicIps,
} from "@/utils/calcPublicIps";

@Component({
  components: {
    Layout,
    DetailsV2,
    InFilter,
    RangeFilter,
    NodesDistribution,
    ConditionFilter,
    ComparisonFilter,
    LayoutFilters,
  },
})
export default class Nodes extends Vue {
  loading = false;
  withGateway = false;
  onlyOnline = true;
  count: number | null = null;
  nodes: INode[] = [];

  headers = [
    { text: "ID", value: "nodeId" },
    { text: "Farm ID", value: "farmId", align: "center" },
    { text: "Total Public IPs", value: "totalPublicIPs", align: "center" },
    { text: "Free Public IPs", value: "freePublicIPs", align: "center" },
    { text: "HRU", value: "hru", align: "center" },
    { text: "SRU", value: "sru", align: "center" },
    { text: "MRU", value: "mru", align: "center" },
    { text: "CRU", value: "total_resources.cru", align: "center" },
    { text: "Up Time", value: "uptime", align: "center" },
  ];

  activeFiltersKeys: string[] = ["Node ID", "HRU", "CRU"];
  filters = [
    {
      label: "Node ID",
      type: "in",
      key: "nodeId",
      placeholder: "Filter by node id.",
    },
    {
      label: "Farm ID",
      type: "in",
      key: "farmId",
      placeholder: "Filter by farm id.",
    },
    {
      label: "Twin ID",
      type: "in",
      key: "twinId",
      placeholder: "Filter by twin id.",
    },
    {
      label: "Country Full Name",
      type: "in",
      key: "countryFullName",
      placeholder: "Filter by country.",
    },
    {
      label: "Farming Policy",
      type: "in",
      key: "farmingPolicyName",
      placeholder: "Filter by farming policy name.",
    },
    {
      label: "SRU",
      type: "range",
      key: "sru",
      placeholder: "sru",
      max: 1e12 * 10, // 1e12 is Terra and we want here 10 Terrabytes
      unit: "TB",
    },
    {
      label: "HRU",
      type: "range",
      key: "hru",
      placeholder: "hru",
      max: 1e12 * 1000, // 1e12 is Terra and we want here 1000 Terrabytes
      unit: "TB",
    },
    {
      label: "MRU",
      type: "range",
      key: "mru",
      placeholder: "mru",
      max: 1e12 * 10, // 1e12 is Terra and we want here 10 Terrabytes
      unit: "TB",
    },
    {
      label: "CRU",
      type: "range",
      key: "cru",
      placeholder: "cru",
      max: 64 * 3,
      unit: "core",
    },
    {
      label: "Free Public IP",
      type: "comparison",
      key: "freePublicIPs",
      placeholder: "Filter by greater than or equal to publicIp Number.",
      prefix: ">=",
    },
    {
      label: "Certification Type",
      type: "in",
      key: "certificationType",
      placeholder: "Filter by certification type",
      value: ["Diy", "Certified"],
    },
  ];

  quries: NodeQuries = {
    ret_count: true,
    size: 15,
  };

  async onLoadNodes(page: number) {
    this.loading = true;
    const res = await GridProxy.nodes<INode[]>({ ...this.quries, page });
    this.count = +res.headers["count"];
    this.nodes = await this.__normalizeNodes(res.data);
    this.loading = false;
  }

  private async __normalizeNodes(nodes: INode[]): Promise<INode[]> {
    return Promise.all(
      nodes.map(async (node: any) => {
        const res = await GridProxy.farms<IFarm[]>({ farm_id: node.farmId });
        const [farm] = res.data;
        const [free, used] = [getFarmFreePublicIps(farm), getFarmUsedPublicIps(farm)]; // prettier-ignore
        node.totalPublicIPs = free + used;
        node.freePublicIPs = free;
        return node;
      })
    );
  }
}
</script>
