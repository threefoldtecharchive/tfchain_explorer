<template>
  <Layout pageName="Nodes">
    <template v-slot:filters>
      <v-col>
        <LayoutFilters
          :items="filters.map((f) => f.label)"
          v-model="activeFiltersKeys"
          @input="changed = true"
        />
        <v-row justify="end">
          <v-btn
            :disabled="!changed || loading"
            type="button"
            :loading="loading"
            color="primary"
            @click="onLoadNodes()"
          >
            Filter
          </v-btn>
        </v-row>
      </v-col>
    </template>

    <template v-slot:active-filters>
      <div v-for="f in activeFilters" :key="f.label">
        <component
          :is="f.component"
          :label="f.label"
          :type="f.type"
          v-model="f.value"
          @input="changed = true"
        />
      </div>
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
            @change="(changed = true) && onLoadNodes()"
          />
          <v-switch
            v-model="onlyOnline"
            label="Online"
            @change="(changed = true) && onLoadNodes()"
          />
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
        @click:row="openSheet"
      >
        <template v-slot:[`item.created`]="{ item }">
          {{ item.created | date }}
        </template>

        <template v-slot:[`item.hru`]="{ item }">
          {{ item.total_resources.hru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.sru`]="{ item }">
          {{ item.total_resources.sru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.mru`]="{ item }">
          {{ item.total_resources.mru | toTeraOrGigaOrPeta }}
        </template>

        <template v-slot:[`item.uptime`]="{ item }">
          {{ item.uptime | secondToRedable }}
        </template>
      </v-data-table>
    </template>

    <template v-slot:details>
      <DetailsV2
        :open="!!node"
        :query="query"
        :variables="
          node
            ? {
                nodeId: node.nodeId,
                farmId: node.farmId,
                twinId: node.twinId,
                country: node.country,
              }
            : {}
        "
        :nodeId="node && node.nodeId"
        v-on:close-sheet="closeSheet"
      />
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
import gql from "graphql-tag";
import {
  getFarmFreePublicIps,
  getFarmUsedPublicIps,
} from "@/utils/calcPublicIps";
import SearchFilter from "@/components/SearchFilter.vue";

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
    SearchFilter,
  },
})
export default class Nodes extends Vue {
  loading = false;
  changed = true;
  withGateway = false;
  onlyOnline = true;
  count: number | null = null;
  nodes: INode[] = [];
  node: INode | null = null;

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

  activeFiltersKeys = ["MRU", "HRU", "SRU"];
  filters = [
    {
      label: "MRU",
      key: "free_mru",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "HRU",
      key: "free_hru",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "SRU",
      key: "free_sru",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "IPS",
      key: "free_ips",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "Country",
      key: "country",
      component: SearchFilter,
      value: "",
    },
    {
      label: "Farm Name",
      key: "farm_name",
      component: SearchFilter,
      value: "",
    },
    {
      label: "Farm IDs",
      key: "farm_ids",
      component: SearchFilter,
      value: "",
    },
  ];

  get activeFilters() {
    const keys = new Set(this.activeFiltersKeys);
    return this.filters.filter((f) => keys.has(f.label));
  }

  private __page = 1;
  async onLoadNodes(page: number = this.__page) {
    try {
      this.__page = page;
      this.loading = true;

      const quries: any = {
        ret_count: this.changed,
        size: 15,
        page,
        status: this.onlyOnline ? "up" : "down",
      };

      if (this.withGateway) {
        quries.ipv4 = true;
        quries.domain = true;
      }

      this.activeFilters.forEach(({ key, value }) => {
        if (value !== null && value !== undefined) quries[key] = value;
      });

      const res = await GridProxy.nodes<INode[]>(quries);
      if (this.changed) {
        this.count = +res.headers["count"];
      }
      this.nodes = await this.__normalizeNodes(res.data);
      this.loading = false;
      this.changed = false;
    } catch {
      this.loading = false;
      this.changed = false;
    }
  }

  private async __normalizeNodes(nodes: INode[]): Promise<INode[]> {
    return Promise.all(
      nodes.map(async (node: any) => {
        const res = await GridProxy.farms<IFarm[]>({ farm_id: node.farmId });
        const [farm] = res.data;
        const [free, used] = [getFarmFreePublicIps(farm), getFarmUsedPublicIps(farm)]; // prettier-ignore
        node.farm = farm;
        node.totalPublicIPs = free + used;
        node.freePublicIPs = free;
        return node;
      })
    );
  }

  query = gql`
    query getNodeDetails(
      $nodeId: Int!
      $farmId: Int!
      $twinId: Int!
      $country: String!
    ) {
      node: nodes(where: { nodeID_eq: $nodeId }) {
        country
        city
        location {
          latitude
          longitude
        }
        nodeId: nodeID
        farmId: farmID
        farmingPolicyId
        gridVersion
        uptime
        created
        updatedAt
        certificationType
        interfaces {
          id
          name
          mac
          ips
        }
        publicConfig {
          ipv4
          gw4
          ipv6
          gw6
          domain
        }
        farmingPolicyId
      }
      farm: farms(where: { farmID_eq: $farmId }) {
        id
        farmId: farmID
        name
        gridVersion
        certificationType
        stellarAddress
      }
      twin: twins(where: { twinID_eq: $twinId }) {
        id
        twinId: twinID
        accountId: accountID
        gridVersion
        ip
      }
      country: countries(where: { name_eq: $country }) {
        code
      }
    }
  `;

  openSheet(node: INode): void {
    this.node = node;
  }
  closeSheet(): void {
    this.node = null;
  }
}
</script>
