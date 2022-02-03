<template>
  <Layout pageName="Farms">
    <template v-slot:filters>
      <!-- @click="toggleActive(idx)" -->
      <v-chip
        v-for="{ chip } in filters"
        :key="chip.label"
        class="ma-2"
        v-model="chip.active"
        filter
      >
        {{ chip.label }}
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
      <div v-for="{ component, filter } in filters" :key="filter.label">
        <component :is="component" :options="filter" v-model="filter.value" />
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
// import InFilter from "@/components/InFilter.vue";
// import ComparisonFilter from "@/components/ComparisonFilter.vue";
// import RangeFilter from "@/components/RangeFilter.vue";
// import ConditionFilter from "@/components/ConditionFilter.vue";
import { IPaginationData } from "@/store/state";
import { PAGE_LIMIT } from "@/json/constants";
import InFilterV2 from "@/components/InFilterV2.vue";
import IFilterOptions from "@/types/FilterOptions";
import apollo from "@/plugins/apollo";

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
    { text: "Total Public IPs", value: "totalPublicIPs", align: "center" },
    { text: "Free Public IPs", value: "freePublicIPs", align: "center" },
    { text: "Used Public IPs", value: "usedPublicIPs", align: "center" },
    { text: "CERTIFICATION TYPE", value: "certificationType", align: "center" },
    { text: "PRICING POLICY", value: "pricingPolicyId", align: "center" },
  ];

  get farms(): IPaginationData<IFarm> {
    return this.$store.state.farms;
  }
  get items(): IFarm[] | undefined {
    return this.farms.items.get(this.page);
  }

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
            items: this.farms.items.set(this.page, items),
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

  public onApplyFilter() {
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
      chip: {
        label: "Name",
        active: true,
      },
      filter: {
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
        value: "",
      },
    },
  ];

  // (value: string) => {
  // return apollo.defaultClient.query<IFilterQuery>({
  //   query: filterQuery("name"),
  //   variables: {
  //     sub_string: value
  //   }
  // }).then<string[]>(({ data }) => {
  //     console.log(data);

  //     return ['1', '2'];
  // });
  // },

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  // activeFilters: any[] = [
  //   {
  //     label: "Name",
  //     type: "in",
  //     active: true,
  //     key: "name",
  //     placeholder: "Filter by farm name",
  //   },
  //   {
  //     label: "Twin ID",
  //     type: "in",
  //     active: true,
  //     key: "twinId",
  //     placeholder: "Filter by twin id.",
  //   },
  //   {
  //     label: "Certification Type",
  //     type: "in",
  //     active: true,
  //     key: "certificationType",
  //     placeholder: "Filter by certification type",
  //     value: ["Diy", "Certified"],
  //   },
  // ];

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
