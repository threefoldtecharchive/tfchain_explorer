<template>
  <Layout pageName="Farms">
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
          key1="farms"
          :key2="filter.key"
          :label="filter.placeholder"
          v-if="filter.type === 'in'"
        />
        <RangeFilter
          v-if="filter.type === 'range'"
          key1="farms"
          :key2="filter.key"
          :label="filter.placeholder"
        />
        <ConditionFilter
          v-if="filter.type === 'condition'"
          key1="farms"
          :key2="filter.key"
          :labels="filter.placeholder"
        />
        <ComparisonFilter
          key1="farms"
          :key2="filter.key"
          :label="filter.placeholder"
          :prefix="filter.prefix"
          v-if="filter.type === 'comparison'"
        />
      </div>
    </template>

    <template v-slot:table>
      <v-data-table
        :loading="$store.getters.loading"
        loading-text="Loading..."
        :headers="headers"
        :items="$store.getters.filtered_farm"
        :items-per-page="10"
        class="elevation-1"
        align
        @click:row="openSheet"
      >
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

    <template v-slot:details>
      <Details
        :open="!!farm"
        :farm="farm"
        :twin="$store.getters.twin(farm && farm.twinId)"
        v-on:close-sheet="closeSheet"
      />
    </template>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Details from "@/components/Details.vue";
import { IFarm } from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import InFilter from "@/components/InFilter.vue";
import ComparisonFilter from "@/components/ComparisonFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";
import ConditionFilter from "@/components/ConditionFilter.vue";

@Component({
  components: {
    Layout,
    Details,
    InFilter,
    ComparisonFilter,
    RangeFilter,
    ConditionFilter,
  },
})
export default class Farms extends Vue {
  headers = [
    { text: "ID", value: "farmId" },
    { text: "NAME", value: "name" },
    { text: "PUBLIC IPS", value: "publicIPs", align: "center" },
    { text: "CERTIFICATION TYPE", value: "certificationType", align: "center" },
    { text: "PRICING POLICY ID", value: "pricingPolicyId", align: "center" },
  ];

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  activeFilters: any[] = [
    {
      label: "Name",
      type: "in",
      active: true,
      key: "name",
      placeholder: "Filter by node name",
    },
    {
      label: "Twin ID",
      type: "in",
      active: true,
      key: "twinId",
      placeholder: "Filter by twin id.",
    },
    {
      label: "Certification Type",
      type: "in",
      active: true,
      key: "certificationType",
      placeholder: "Filter by certification type",
      value: ["Diy", "Certified"],
    },
  ];

  filters = [
    {
      label: "Farm ID",
      type: "in",
      active: false,
      key: "farmId",
      placeholder: "Filter by farm id.",
    },
    ...this.activeFilters,
    {
      label: "Public IP",
      type: "comparison",
      active: false,
      key: "publicIPsNo",
      placeholder: "Filter by greater than or equal to publicIp Number.",
      prefix: ">=",
    },
  ];

  toggleActive(idx: number) {
    const filter = this.filters[idx];

    if (filter.active) {
      this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
      filter.active = false;
    } else {
      filter.active = true;
      this.activeFilters.push(filter);
    }
  }

  farm: IFarm | null = null;

  openSheet(farm: IFarm): void {
    this.farm = farm;
  }

  closeSheet(): void {
    this.farm = null;
  }
}
</script>
