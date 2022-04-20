<template>
  <Layout pageName="Farms">
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
            @click="onLoadFarms()"
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
      <v-data-table
        :loading="loading"
        loading-text="Loading..."
        :headers="headers"
        class="elevation-1"
        align
        :items-per-page="15"
        :server-items-length="count"
        :items="farms"
        :disable-pagination="loading"
        :footer-props="{
          'disable-items-per-page': true,
          'disable-pagination': loading,
        }"
        :disable-sort="false"
        multi-sort
        @update:options="onLoadFarms($event.page)"
        @click:row="openSheet"
      >
        <template v-slot:[`item.certificationType`]="{ item }">
          {{ item.certificationType }}
        </template>

        <template v-slot:[`item.publicIPs`]="{ item }">
          {{ item.publicIPs.length }}
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt | date }}
        </template>

        <template v-slot:[`item.updatedAt`]="{ item }">
          <v-icon :color="item.updatedAt ? 'green' : 'red'">
            {{ item.updatedAt ? "mdi-check" : "mdi-close" }}
          </v-icon>
        </template>

        <template v-slot:[`item.totalPublicIp`]="{ item }">
          {{ item.totalPublicIp }}
        </template>

        <template v-slot:[`item.freePublicIp`]="{ item }">
          {{ item.freePublicIp }}
        </template>

        <template v-slot:[`item.usedPublicIp`]="{ item }">
          {{ item.usedPublicIp }}
        </template>
      </v-data-table>
    </template>

    <template v-slot:details>
      <DetailsV2
        :open="!!farm"
        :query="query"
        :variables="farm ? { farmId: farm.farmId, twinId: farm.twinId } : {}"
        v-on:close-sheet="closeSheet"
      />
    </template>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import DetailsV2 from "@/components/DetailsV2.vue";
import {
  filterQuery,
  getFarmsQuery,
  IFarm,
  IFetchPaginatedData,
  IFilterQuery,
} from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import { IPaginationData } from "@/store/state";
import { PAGE_LIMIT } from "@/json/constants";
import InFilterV2 from "@/components/InFilterV2.vue";
import IFilterOptions from "@/types/FilterOptions";
import apollo from "@/plugins/apollo";
import getFarmPublicIPs from "@/utils/getFarmPublicIps";
import gql from "graphql-tag";
import equalArrays from "@/utils/equalArrays";
import LayoutFilters from "@/components/LayoutFilters.vue";
import { GridProxy } from "@/utils/gridProxy";
import { FarmQuries } from "@/types/gridProxy";
import {
  getFarmFreePublicIps,
  getFarmUsedPublicIps,
} from "@/utils/calcPublicIps";
import SearchFilter from "@/components/SearchFilter.vue";

@Component({
  components: {
    Layout,
    DetailsV2,
    InFilterV2,
    LayoutFilters,
    SearchFilter,
  },
})
export default class Farms extends Vue {
  changed = true;
  loading = false;
  count = 0;
  farms: IFarm[] = [];

  // prettier-ignore
  headers = [
    { text: "ID", value: "farmId" },
    { text: "NAME", value: "name" },
    { text: "Total Public IPs", value: "totalPublicIp", align: "center", sortable: false },
    { text: "Free Public IPs", value: "freePublicIp", align: "center", sortable: false },
    { text: "Used Public IPs", value: "usedPublicIp", align: "center", sortable: false },
    { text: "CERTIFICATION TYPE", value: "Certification_type", align: "center", sortable: false },
    { text: "PRICING POLICY", value: "pricingPolicyId", align: "center", sortable: false },
  ];

  private __page = 1;
  async onLoadFarms(page: number = this.__page) {
    try {
      this.__page = page;
      this.loading = true;

      const quries: any = {
        ret_count: this.changed,
        page,
        size: 15,
      };

      this.activeFilters.forEach(({ key, value }) => {
        if (value !== null && value !== undefined) quries[key] = value;
      });

      const res = await GridProxy.farms<IFarm[]>(quries);
      if (this.changed) {
        this.count = +res.headers["count"];
      }
      this.farms = await this.__normalizeFarms(res.data);
      this.loading = false;
      this.changed = false;
    } catch {
      this.loading = false;
      this.changed = false;
    }
  }

  private async __normalizeFarms(farms: IFarm[]): Promise<IFarm[]> {
    const res = await GridProxy.farmingPolicies();
    const policies: { [key: number]: string } = res.data.reduce(
      (res: any, { id, name }: any) => {
        res[id] = name;
        return res;
      },
      {}
    );

    return farms.map((farm: any) => {
      const free = getFarmFreePublicIps(farm);
      const used = getFarmUsedPublicIps(farm);
      farm.totalPublicIp = free + used;
      farm.freePublicIp = free;
      farm.usedPublicIp = used;
      farm.pricingPolicyId = policies[farm.pricingPolicyId];
      return farm;
    });
  }

  activeFiltersKeys = ["Farm ID", "Name", "Free IPs"];
  filters = [
    {
      label: "Free IPs",
      key: "free_ips",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "Total IPs",
      key: "total_ips",
      component: SearchFilter,
      type: "number",
      value: 0,
    },
    {
      label: "Pricing Policy ID",
      key: "pricing_policy_id",
      component: SearchFilter,
      type: "number",
      value: null,
    },
    {
      label: "Version",
      key: "version",
      component: SearchFilter,
      value: null,
    },
    {
      label: "Farm ID",
      key: "farm_id",
      component: SearchFilter,
      type: "number",
      value: null,
    },
    {
      label: "Twin ID",
      key: "twin_id",
      component: SearchFilter,
      type: "number",
      value: null,
    },
    {
      label: "Name",
      key: "name",
      component: SearchFilter,
      value: null,
    },
    {
      label: "Name Contains",
      key: "name_contains",
      component: SearchFilter,
      value: null,
    },
    {
      label: "Certification Type",
      key: "certification_type",
      component: SearchFilter,
      value: null,
    },
    {
      label: "Stellar Address",
      key: "stellar_address",
      component: SearchFilter,
      value: null,
    },
  ];

  get activeFilters() {
    const keys = new Set(this.activeFiltersKeys);
    return this.filters.filter((f) => keys.has(f.label));
  }

  farm: IFarm | null = null;
  query = gql`
    query getFarmDetails($farmId: Int!, $twinId: Int!) {
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
    }
  `;

  openSheet(farm: IFarm): void {
    this.farm = farm;
  }

  closeSheet(): void {
    this.farm = null;
  }
}
</script>
