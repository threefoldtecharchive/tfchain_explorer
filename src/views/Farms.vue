<template>
  <Layout pageName="Farms">
    <template v-slot:filters>
      <v-chip
        v-for="filter in filters"
        class="ma-2"
        filter
        :key="filter.chip_label"
        v-model="filter.active"
        :color="filter.active ? 'primary' : undefined"
        @click="filter.active = !filter.active"
      >
        {{ filter.chip_label }}
      </v-chip>
      <v-chip class="ma-2" disabled> Free Public IP </v-chip>
    </template>

    <template v-slot:apply-filters>
      <v-btn
        color="primary"
        :disabled="loading || !changed"
        :loading="loading"
        @click="onApplyFilter"
        class="mt-2"
      >
        Apply Filter
      </v-btn>
    </template>

    <template v-slot:active-filters>
      <div v-for="filter in filters" :key="filter.label">
        <component
          v-if="filter.active"
          :is="filter.component"
          :options="filter"
          v-model="filter.value"
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
        :server-items-length="farms.total"
        :items="items"
        :disable-pagination="loading"
        :page="page + 1"
        :footer-props="{
          'disable-items-per-page': true,
          'disable-pagination': loading,
        }"
        @click:row="openSheet"
        :disable-sort="false"
        multi-sort
        @update:options="
          onUpdateOptions($event.page, $event.sortBy, $event.sortDesc)
        "
      >
        <!-- @update:options="
          sort = { sortBy: $event.sortBy[0], desc: $event.sortDesc[0] }
        "
        @pagination="page = $event.page - 1" -->
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

        <template v-slot:[`item.pricingPolicyId`]="{ item }">
          {{ pricingPolicy(item.pricingPolicyId) }}
        </template>
      </v-data-table>
    </template>

    <template v-slot:details>
      <DetailsV2
        :open="!!farm"
        :query="query"
        :variables="farm ? { farmId: farm.id, twinId: farm.twinId } : {}"
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

@Component({
  components: {
    Layout,
    DetailsV2,
    InFilterV2,
  },
})
export default class Farms extends Vue {
  sort: { by: string[]; desc: boolean[] } = { by: [], desc: [] };

  value = "";
  page = 0;
  loading = false;
  changed = false;

  // prettier-ignore
  headers = [
    { text: "ID", value: "id" },
    { text: "NAME", value: "name" },
    { text: "Total Public IPs", value: "totalPublicIp", align: "center", sortable: false },
    { text: "Free Public IPs", value: "freePublicIp", align: "center", sortable: false },
    { text: "Used Public IPs", value: "usedPublicIp", align: "center", sortable: false },
    { text: "PRICING POLICY", value: "pricingPolicyId", align: "center", sortable: false },
  ];

  get farms(): IPaginationData<IFarm> {
    return this.$store.state.farms;
  }

  get items(): IFarm[] | undefined {
    return this.farms.items.get(this.page);
  }

  private get _pricingPolicy(): Map<number, string> {
    return this.$store.state.pricingPolicies;
  }

  onUpdateOptions(page: number, sortBy: string[], sortDesc: boolean[]) {
    const _by = this.sort.by;
    const _desc = this.sort.desc;

    this.page = page - 1;
    this.sort = {
      by: sortBy,
      desc: sortDesc,
    };

    if (!equalArrays(_by, sortBy) || !equalArrays(_desc, sortDesc)) {
      this.onApplyFilter();
    }
  }

  public pricingPolicy(id: number) {
    const name = this._pricingPolicy.get(id);
    return name ? name : id;
  }

  private _vars: any = {};

  @Watch("page", { immediate: true })
  public onUpdatePage() {
    if (this.items) return;
    this.loading = true;
    this.$apollo
      .query<IFetchPaginatedData<IFarm>>({
        query: getFarmsQuery,
        variables: {
          limit: PAGE_LIMIT,
          offset: this.page * PAGE_LIMIT,
          ...this._vars,
        },
      })
      .then(
        ({
          data: {
            total: { count },
            items,
          },
        }) => {
          this.$store.state.farms = {
            total: count,
            items: this.farms.items.set(this.page, items.map(getFarmPublicIPs)),
          };
        }
      )
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public getKeyByValue(value: string): number | null {
    const map = this._pricingPolicy;
    const keys = [...map.keys()];
    const values = [...map.values()];

    for (let i = 0; i < values.length; i++) {
      if (values[i] === value) return keys[i];
    }

    return null;
  }

  public onApplyFilter() {
    this.changed = false;
    const _vars: any = this.filters
      .filter((f) => f.active)
      .filter((f) => (Array.isArray(f.value) ? f.value.length > 0 : true))
      .reduce((res, f) => {
        const { symbol, value, getValue } = f;
        res[symbol] = getValue?.(f) ?? value;
        return res;
      }, {} as { [key: string]: any });

    const orderBy: string[] = [];
    for (let i = 0; i < this.sort.by.length; i++) {
      const by = this.sort.by[i];
      const desc = this.sort.desc[i];

      switch (by) {
        case "id":
          orderBy.push(desc ? "farmId_DESC" : "farmId_ASC");
          break;

        case "name":
          orderBy.push(desc ? "name_DESC" : "name_ASC");
          break;
      }
    }

    _vars.orderBy = orderBy.length === 0 ? undefined : orderBy;
    this._vars = _vars;

    this.$store.state.farms = {
      total: 0,
      items: new Map(),
    };
    if (this.page === 0) this.onUpdatePage();
    else this.page = 0;
  }

  public filters: IFilterOptions[] = [
    {
      component: InFilterV2,
      chip_label: "Farm ID",
      active: true,
      label: "Filter By Farm ID",
      items: () => Promise.resolve([]),
      value: [],
      multiple: true,
      type: "number",
      symbol: "farmId_in",
    },
    {
      component: InFilterV2,
      chip_label: "Name",
      active: false,
      label: "Filter By Farm Name",
      items(sub_string: string) {
        return apollo.defaultClient
          .query<IFilterQuery>({
            query: filterQuery("name"),
            variables: { sub_string },
          })
          .then(({ data }) => {
            return data.items.map((x) => x.value);
          });
      },
      value: [],
      multiple: true,
      symbol: "name_in",
    },
    {
      component: InFilterV2,
      chip_label: "Twin ID",
      active: false,
      label: "Filter By Twin ID",
      items: (_) => Promise.resolve([]),
      value: [],
      type: "number",
      multiple: true,
      symbol: "twinId_in",
    },
    {
      component: InFilterV2,
      chip_label: "Certification Type",
      active: false,
      label: "Filter By Certification Type",
      items: (_) => Promise.resolve(["Diy", "Certified"]),
      value: [],
      init: true,
      multiple: true,
      symbol: "certificationType_in",
    },
    {
      component: InFilterV2,
      chip_label: "Pricing Policy",
      active: false,
      label: "Filter By Pricing policy",
      items: (_) => Promise.resolve([...this._pricingPolicy.values()]),
      value: [],
      init: true,
      multiple: true,
      symbol: "pricingPolicyId_in",
      getValue: (f) => {
        return (f.value as string[]).map(this.getKeyByValue.bind(this));
      },
    },
  ];

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

  farm: IFarm | null = null;

  openSheet(farm: IFarm): void {
    this.farm = farm;
  }

  closeSheet(): void {
    this.farm = null;
  }
}
</script>
