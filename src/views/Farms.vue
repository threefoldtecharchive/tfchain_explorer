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
    </template>

    <template v-slot:apply-filters>
      <v-btn
        color="primary"
        :disabled="loading"
        :loading="loading"
        @click="onApplyFilter"
        >Apply Filter</v-btn
      >
    </template>

    <template v-slot:active-filters>
      <div v-for="filter in filters" :key="filter.label">
        <component
          v-if="filter.active"
          :is="filter.component"
          :options="filter"
          v-model="filter.value"
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
        :items-per-page="10"
        :server-items-length="farms.total"
        @pagination="page = $event.page - 1"
        :items="items"
        :disable-pagination="loading"
        :page="page + 1"
        :footer-props="{
          'disable-items-per-page': true,
          'disable-pagination': loading,
        }"
      >
        <!-- @click:row="openSheet" -->
        <template v-slot:[`item.certificationType`]="{ item }">
          <v-chip :color="item.certificationType === 'Diy' ? 'red' : 'green'">
            {{ item.certificationType }}
          </v-chip>
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

        <template v-slot:[`item.total`]="{ item }">
          {{ item.publicIpStatus.total }}
        </template>

        <template v-slot:[`item.free`]="{ item }">
          {{ item.publicIpStatus.free }}
        </template>

        <template v-slot:[`item.used`]="{ item }">
          {{ item.publicIpStatus.used }}
        </template>

        <template v-slot:[`item.pricingPolicyId`]="{ item }">
          {{ pricingPolicy(item.pricingPolicyId) }}
        </template>
      </v-data-table>
    </template>

    <!-- <template v-slot:details>
      <Details
        :open="!!farm"
        :farm="farm"
        v-on:close-sheet="closeSheet"
        :twin="$store.getters.twin(farm && farm.twinId)"
      />
    </template> -->
  </Layout>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Details from "@/components/Details.vue";
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

@Component({
  components: {
    Layout,
    Details,
    InFilterV2,
    // InFilter,
    // ComparisonFilter,
    // RangeFilter,
    // ConditionFilter,
  },
})
export default class Farms extends Vue {
  value = "";
  c = InFilterV2;
  page = 0;
  loading = false;
  headers = [
    { text: "ID", value: "id" },
    { text: "NAME", value: "name" },
    { text: "Total Public IPs", value: "total", align: "center" },
    { text: "Free Public IPs", value: "free", align: "center" },
    { text: "Used Public IPs", value: "used", align: "center" },
    { text: "CERTIFICATION TYPE", value: "certificationType", align: "center" },
    { text: "PRICING POLICY", value: "pricingPolicyId", align: "center" },
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

  public pricingPolicy(id: number) {
    const name = this._pricingPolicy.get(id);
    return name ? name : id;
  }

  private _vars: any = {}

  @Watch("page", { immediate: true })
  public onUpdatePage() {
    if (this.items) return;
    console.log("our filters",this._vars)
    this.loading = true;
    this.$apollo
      .query<IFetchPaginatedData<IFarm>>({
        query: getFarmsQuery,
        variables: {
          limit: PAGE_LIMIT,
          offset: this.page * PAGE_LIMIT,
          ...this._vars
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

  public getKeyByValue(value: string): number| null  {
    const map = this._pricingPolicy;
    const keys = [...map.keys()];
    const values = [...map.values()];

    for (let i = 0; i < values.length; i++) {
        if (values[i] === value) return keys[i];
    }

    return null;
}

  
  public onApplyFilter() {
    this._vars = this.filters.filter(f => f.active).filter(f => Array.isArray(f.value)? f.value.length>0 : true).map(f => {
      if (f.symbol !== "pricingPolicyId_in") return f;
      return { ...f, value: (f.value as string[]).map(this.getKeyByValue.bind(this))}
    }).reduce((res, { symbol, value}) => {
      res[symbol] = value;
      return res;
    }, {} as { [key: string]: any})
    
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
      symbol:"twinId_in",
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
      symbol: "certificationType_in"
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
      symbol: "pricingPolicyId_in"
    },
  ];

  // filters = [
  //   {
  //     label: "Farm ID",
  //     type: "in",
  //     active: false,
  //     key: "farmId",
  //     placeholder: "Filter by farm id.",
  //   },
  //   ...this.activeFilters,
  //   {
  //     label: "Free Public IP",
  //     type: "comparison",
  //     active: false,
  //     key: "freePublicIPs",
  //     placeholder: "Filter by greater than or equal to publicIp Number.",
  //     prefix: ">=",
  //   },
  //   {
  //     label: "Pricing Policy",
  //     type: "in",
  //     active: false,
  //     key: "pricingPolicyName",
  //     placeholder: "Filter by pricing policy name",
  //   },
  // ];

  // toggleActive(idx: number) {
  //   const filter = this.filters[idx];

  //   if (filter.active) {
  //     this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
  //     filter.active = false;
  //   } else {
  //     filter.active = true;
  //     this.activeFilters.push(filter);
  //   }
  // }

  // farm: IFarm | null = null;

  // openSheet(farm: IFarm): void {
  //   this.farm = farm;
  // }

  // closeSheet(): void {
  //   this.farm = null;
  // }
}
</script>
